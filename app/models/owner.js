import VcsEntity from 'travis/models/vcs-entity';
import { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, or, equal, notEmpty, filterBy } from '@ember/object/computed';
import config from 'travis/config/environment';
import dynamicQuery from 'travis/utils/dynamic-query';

const { profileReposPerPage: limit } = config.pagination;

export default VcsEntity.extend({
  features: service(),
  accounts: service(),
  raven: service(),
  store: service(),
  tasks: service(),

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

  // This is set by serializers:subscription
  subscriptionPermissions: attr(),

  installation: belongsTo('installation', { async: false, inverse: 'owner' }),

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
    const offset = (page - 1) * limit;
    const owner = this.login;
    const type = 'byOwner';
    const shouldSkip = ghApps && !this.features.get('github-apps');

    return shouldSkip ? [] : this.store.paginated('repo', {
      'repository.managed_by_installation': ghApps,
      'repository.active_on_org': activeOnOrg,
      'repository.active': active,
      sort_by: 'name',
      name_filter: filter,
      limit, offset, custom: { owner, type, },
    }, { live: false });
  },

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
      let subscription = this.subscription;
      let writePermissions = this.get('subscription.permissions.write');
      let createPermissions = this.get('subscriptionPermissions.create');
      return subscription ? writePermissions : createPermissions;
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
