import VcsEntity from 'travis/models/vcs-entity';
import { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import {
  equal,
  filterBy,
  match,
  notEmpty,
  or,
  reads
} from '@ember/object/computed';
import config from 'travis/config/environment';
import dynamicQuery from 'travis/utils/dynamic-query';

const { profileReposPerPage: limit } = config.pagination;

export default VcsEntity.extend({
  features: service(),
  accounts: service(),
  raven: service(),
  store: service(),
  tasks: service(),
  api: service(),

  name: attr('string'),
  login: attr('string'),
  channels: attr(),
  isSyncing: attr('boolean'),
  syncedAt: attr('date'),
  createdAt: attr('date'),
  avatarUrl: attr('string'),
  githubId: attr('string'),
  education: attr('boolean'),
  fullName: or('name', 'login'),
  permissions: attr(),
  type: attr('string'),
  isUser: equal('type', 'user'),
  isOrganization: equal('type', 'organization'),
  isAssembla: match('vcsType', /Assembla\S+$/),

  allowance: belongsTo('allowance', { async: true }),

  // This is set by serializers:subscription
  subscriptionPermissions: attr(),

  installation: belongsTo('installation', { async: false }),

  title: or('name', 'login'),

  githubAppsRepositories: dynamicQuery(function* ({ page = 1, filter = '' }) {
    return yield this.fetchRepositories({ page, filter, ghApps: true, activeOnOrg: false });
  }),

  githubAppsRepositoriesOnOrg: dynamicQuery(function* ({ page = 1, filter = '' }) {
    return yield this.fetchRepositories({ page, filter, ghApps: true, activeOnOrg: true });
  }),

  legacyRepositories: dynamicQuery(function* ({ page = 1, filter = '' }) {
    const isGithubAppsEnabled = this.features.get('github-apps');
    const active = isGithubAppsEnabled ? true : undefined;
    return yield this.fetchRepositories({ page, filter, ghApps: false, active });
  }),

  fetchRepositories({ page, filter, ghApps, active, activeOnOrg }) {
    const { provider, login: owner } = this;
    const offset = (page - 1) * limit;
    const type = 'byOwner';
    const shouldSkip = ghApps && !this.features.get('github-apps');

    return shouldSkip ? [] : this.store.paginated('repo', {
      'repository.managed_by_installation': ghApps,
      'repository.active_on_org': activeOnOrg,
      'repository.active': active,
      limit,
      offset,
      name_filter: filter,
      sort_by: 'name',
      provider,
      custom: { owner, type, },
    }, { live: false });
  },

  fetchPlans: task(function* () {
    const url = this.isOrganization ? `/plans_for/organization/${this.id}` : '/plans_for/user';
    const result = yield this.api.get(url);
    return result ? result.plans : [];
  }).keepLatest(),

  fetchPlansInstance: computed(function () {
    return this.fetchPlans.perform();
  }),

  isFetchPlansRunning: reads('fetchPlansInstance.isRunning'),
  eligiblePlans: reads('fetchPlansInstance.value'),

  nonGithubPlans: computed('eligiblePlans.@each.{id,name,annual,builds}', function () {
    const eligiblePlans = this.eligiblePlans || [];
    return eligiblePlans.filter(plan => plan.id && !plan.id.startsWith('github'));
  }),

  monthlyPlans: computed('nonGithubPlans.@each.{name,annual,builds}', function () {
    const filteredMonthlyPlans = this.nonGithubPlans.filter(plan => !plan.annual && plan.builds);
    return filteredMonthlyPlans.sortBy('builds');
  }),

  annualPlans: computed('nonGithubPlans.@each.{name,annual,builds}', function () {
    const nonGithubPlans = this.nonGithubPlans || [];
    const filteredAnnualPlans = nonGithubPlans.filter(plan => plan.annual && plan.builds);
    return filteredAnnualPlans.sortBy('builds');
  }),

  fetchV2Plans: task(function* () {
    const { id, type } = this; // owner properties
    const plans = yield this.store.query('v2-plan-config', { type, orgId: id });
    if (plans)
      return plans;
    return [];
  }).drop(),

  isFetchV2PlansRunning: reads('fetchV2Plans.isRunning'),
  eligibleV2Plans: reads('fetchV2Plans.lastSuccessful.value'),
  availableStandaloneAddons: reads('v2subscription.plan.availableStandaloneAddons'),

  fetchBetaMigrationRequests() {
    return this.tasks.fetchBetaMigrationRequestsTask.perform();
  },

  migrationBetaRequests: computed('tasks.fetchBetaMigrationRequestsTask.lastSuccessful.value.[]', 'login', function () {
    const requests = this.tasks.fetchBetaMigrationRequestsTask.get('lastSuccessful.value') || [];
    return requests.filter(request =>
      this.isUser && request.ownerName == this.login || request.organizations.mapBy('login').includes(this.login)
    );
  }),

  isMigrationBetaRequested: notEmpty('migrationBetaRequests'),

  isMigrationBetaAccepted: computed('migrationBetaRequests.@each.acceptedAt', function () {
    const migrationBetaRequests = this.migrationBetaRequests || [];
    return migrationBetaRequests.isAny('acceptedAt');
  }),

  subscriptionError: reads('accounts.subscriptionError'),
  subscriptions: reads('accounts.subscriptions'),

  accountSubscriptions: computed(
    'subscriptions.@each.{validTo,owner,isSubscribed,isPending,isIncomplete}',
    'login',
    function () {
      let subscriptions = this.subscriptions || [];
      return subscriptions.filterBy('owner.login', this.login);
    }),

  activeAccountSubscriptions: filterBy('accountSubscriptions', 'isSubscribed'),
  incompleteAccountSubscriptions: filterBy('accountSubscriptions', 'isIncomplete'),
  pendingAccountSubscriptions: filterBy('accountSubscriptions', 'isPending'),
  expiredAccountSubscriptions: filterBy('accountSubscriptions', 'isExpired'),
  expiredStripeSubscriptions: filterBy('expiredAccountSubscriptions', 'isStripe'),

  expiredStripeSubscription: computed('expiredStripeSubscriptions.[]', function () {
    if (this.expiredStripeSubscriptions.length > 1) {
      this.logMultipleSubscriptionsError();
    }
    return this.expiredStripeSubscriptions.get('firstObject');
  }),

  subscription: computed(
    'accountSubscriptions.[]',
    'activeAccountSubscriptions.[]',
    'pendingAccountSubscriptions.[]',
    'incompleteAccountSubscriptions.[]', function () {
      if (this.activeAccountSubscriptions.length > 1 ||
        this.pendingAccountSubscriptions.length > 1 ||
        this.incompleteAccountSubscriptions.length > 1) {
        this.logMultipleSubscriptionsError();
      }
      return this.activeAccountSubscriptions.get('firstObject') ||
        this.pendingAccountSubscriptions.get('firstObject') ||
        this.incompleteAccountSubscriptions.get('firstObject') ||
        this.accountSubscriptions.get('lastObject');
    }),

  v2subscriptions: reads('accounts.v2subscriptions'),

  accountv2Subscriptions: computed(
    'v2subscriptions.@each.{owner}',
    'login',
    function () {
      let subscriptions = this.v2subscriptions || [];
      return subscriptions.filterBy('owner.login', this.login);
    }),

  v2subscription: computed(
    'accountv2Subscriptions.[]', function () {
      if (this.accountv2Subscriptions.length > 1) {
        this.logMultipleSubscriptionsError();
      }
      return this.accountv2Subscriptions.get('lastObject');
    }),

  trial: computed('accounts.trials.@each.{created_at,owner,hasTrial}', 'login', function () {
    let trials = this.get('accounts.trials') || [];
    let login = this.login;
    const accountTrials = trials.filterBy('owner.login', login) || [];
    const activeAccountTrials = accountTrials.filterBy('hasTrial') || [];
    return activeAccountTrials.get('firstObject') || accountTrials.get('lastObject');
  }),

  hasSubscriptionPermissions: computed(
    'subscription',
    'subscription.permissions.write',
    'subscriptionPermissions.create',
    function () {
      let writePermissions = this.get('subscription.permissions.write');
      let createPermissions = this.get('subscriptionPermissions.create');
      return this.subscription ? writePermissions : createPermissions;
    }
  ),

  billingUrl: computed('type', 'login', function () {
    let type = this.type;
    let login = this.login;
    let id = type === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
  }),

  newSubscriptionUrl: computed('isUser', 'login', function () {
    let isUser = this.isUser;
    let login = this.login;
    let id = isUser ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/new?id=${id}`;
  }),

  logMultipleSubscriptionsError() {
    const exception = new Error(`Account ${this.login} has more than one active subscription!`);
    this.raven.logException(exception, true);
  }
});
