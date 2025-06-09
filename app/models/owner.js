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
  reads,
  empty,
  not
} from '@ember/object/computed';
import config from 'travis/config/environment';
import dynamicQuery from 'travis/utils/dynamic-query';
import { sortBy } from 'lodash';

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
  roMode: attr('boolean', { defaultValue: false }),
  isUser: equal('type', 'user'),
  isOrganization: equal('type', 'organization'),
  isAssembla: match('vcsType', /Assembla\S+$/),
  trialAllowed: attr('boolean', { defaultValue: false}),
  accountEnvVars: attr(),

  allowance: belongsTo('allowance', { async: true, inverse: 'owner', polymorphic: true, as: 'owner' }),

  // This is set by serializers:subscription
  subscriptionPermissions: attr(),

  installation: belongsTo('installation', { async: false }),

  title: or('name', 'login'),

  githubAppsRepositories: dynamicQuery(function* ({ page = 1, filter = '' }) {
    return  yield this.fetchRepositories({ page, filter, ghApps: true, activeOnOrg: false });
  }),

  githubAppsRepositoriesOnOrg: dynamicQuery(function* ({ page = 1, filter = '' }) {
    return yield this.fetchRepositories({ page, filter, ghApps: true, activeOnOrg: true });
  }),

  legacyRepositories: dynamicQuery(function* ({ page = 1, filter = '' }) {
    const isGithubAppsEnabled = this.features.get('github-apps');
    const active = isGithubAppsEnabled ? true : undefined;
    return  yield this.fetchRepositories({ page, filter, ghApps: false, active });
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
      noInclude: true,
      representation: 'list',
      custom: { owner, type, },
    }, { live: false });
  },

  customImages: reads('fetchCustomImages.lastSuccessful.value'),
  hasCustomImageAllowance: attr('boolean'),

  fetchCustomImages: task(function* () {
    try {
      this.hasCustomImageAllowance = true
      return yield this.store.query('custom-image', { login: this.login, provider: this.provider });
    } catch(e) {
      this.hasCustomImageAllowance = false
      return []
    }
  }).drop(),

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
    return sortBy(filteredMonthlyPlans, 'builds');
  }),

  annualPlans: computed('nonGithubPlans.@each.{name,annual,builds}', function () {
    const nonGithubPlans = this.nonGithubPlans || [];
    const filteredAnnualPlans = nonGithubPlans.filter(plan => plan.annual && plan.builds);
    return sortBy(filteredAnnualPlans, 'builds');
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
    const last = this.tasks.fetchBetaMigrationRequestsTask.lastSuccessful;

    const requests = (last && last.value) ? last.value : [];
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
      let login = this.login;
      return subscriptions.filter((el) => el.owner.login == login);
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
    'v2subscriptions',
    'login',
    function () {
      let subscriptions = this.v2subscriptions || [];
      let ownedSubscriptions = subscriptions.filterBy('owner.login', this.login);

      if ((!ownedSubscriptions || ownedSubscriptions.length == 0) && this.isOrganization) {
        for (let s of subscriptions) {
          let shares =  s.planShares || [];
          for (let share of shares) {
            if (share.receiver.id == this.id) {
              s.sharedBy = share.donor.id;
              return [s];
            }
          }
        }
      }
      return ownedSubscriptions;
    }),

  v2subscription: computed(
    'accountv2Subscriptions.[]', 'login', function () {
      if (this.accountv2Subscriptions.length > 1) {
        this.logMultipleSubscriptionsError();
      }
      return this.accountv2Subscriptions.get('lastObject');
    }),

  isV2SubscriptionEmpty: empty('v2subscription'),
  hasV2Subscription: not('isV2SubscriptionEmpty'),
  hasCredits: computed('hasV2Subscription', 'v2subscription', function () {
    return this.hasV2Subscription ? this.v2subscription.get('hasCredits') : false;
  }),

  isNotGithubOrManual: computed('hasV2Subscription', 'v2subscription', 'subscription', function () {
    if (!this.v2subscription && !this.subscription) return false;
    return this.hasV2Subscription ? this.v2subscription.get('isNotGithubOrManual') : this.subscription.get('isNotGithubOrManual');
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
  },

  executions: reads('fetchExecutions.lastSuccessful.value'),

  fetchExecutions: task(function* (from, to) {
    const url = `/v3/owner/${this.provider}/${this.login}/executions?from=${from}&to=${to}`;
    const result = yield this.api.get(url);
    return result ? result.executions : [];
  }).keepLatest(),

  executionsPerRepo: reads('fetchExecutionsPerRepo.lastSuccessful.value'),

  fetchExecutionsPerRepo: task(function* (from, to) {
    const url = `/v3/owner/${this.provider}/${this.login}/executions_per_repo?from=${from}&to=${to}`;
    const result = yield this.api.get(url);
    return result ? result.executionsperrepo : [];
  }).keepLatest(),

  executionsPerSender: reads('fetchExecutionsPerSender.lastSuccessful.value'),

  fetchExecutionsPerSender: task(function* (from, to) {
    const url = `/v3/owner/${this.provider}/${this.login}/executions_per_sender?from=${from}&to=${to}`;
    const result = yield this.api.get(url);
    return result ? result.executionspersender : [];
  }).keepLatest(),

  isPlanShareEnabled: computed('vcsType', function () {
    const vcs = this.vcsType ? this.vcsType.replace(/User|Organization/g, '').toLowerCase() : 'github';
    return !!this.features.get(`enable-${vcs}-plan-share`);
  }),
});
