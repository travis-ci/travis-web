import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { reads, or, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import dynamicQuery from 'travis/utils/dynamic-query';
import { task } from 'ember-concurrency';

const { profileReposPerPage: limit } = config.pagination;

export default Model.extend({
  features: service(),
  accounts: service(),
  raven: service(),
  ajax: service(),
  store: service(),

  name: attr('string'),
  login: attr('string'),
  isSyncing: attr('boolean'),
  syncedAt: attr(),
  avatarUrl: attr('string'),
  githubId: attr('string'),
  education: attr('boolean'),
  fullName: or('name', 'login'),

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
    return this.fetchBetaMigrationRequestsTask.perform();
  },

  fetchBetaMigrationRequestsTask: task(function* () {
    const data = yield this.ajax.getV3(`/user/${this.accounts.user.id}/beta_migration_requests`);
    this.store.pushPayload('beta-migration-request', data);
    return this.store.peekAll('beta-migration-request');
  }),

  migrationBetaRequests: reads('fetchBetaMigrationRequestsTask.lastSuccessful.value'),

  isMigrationBetaRequested: notEmpty('migrationBetaRequests'),

  isMigrationBetaAccepted: computed('migrationBetaRequests.@each.acceptedAt', function () {
    const migrationBetaRequests = this.migrationBetaRequests || [];
    return migrationBetaRequests.isAny('acceptedAt');
  }),

  subscriptionError: reads('accounts.subscriptionError'),

  subscription: computed(
    'accounts.subscriptions.@each.{validTo,owner,isSubscribed}',
    'login',
    function () {
      let subscriptions = this.get('accounts.subscriptions') || [];
      let login = this.get('login');
      const accountSubscriptions = subscriptions.filterBy('owner.login', login) || [];
      const activeAccountSubscriptions = accountSubscriptions.filterBy('isSubscribed') || [];
      if (activeAccountSubscriptions.length > 1) this.logMultipleSubscriptionsError();
      return activeAccountSubscriptions.get('firstObject') ||
        accountSubscriptions.get('lastObject');
    }
  ),

  trial: computed('accounts.trials.@each.{created_at,owner,hasTrial}', 'login', function () {
    let trials = this.get('accounts.trials') || [];
    let login = this.get('login');
    const accountTrials = trials.filterBy('owner.login', login) || [];
    const activeAccountTrials = accountTrials.filterBy('hasTrial') || [];
    return activeAccountTrials.get('firstObject') || accountTrials.get('lastObject');
  }),

  hasSubscriptionPermissions: computed(
    'subscription',
    'subscription.permissions.write',
    'subscriptionPermissions.create',
    function () {
      let subscription = this.get('subscription');
      let writePermissions = this.get('subscription.permissions.write');
      let createPermissions = this.get('subscriptionPermissions.create');
      return subscription ? writePermissions : createPermissions;
    }
  ),

  billingUrl: computed('type', 'login', function () {
    let type = this.get('type');
    let login = this.get('login');
    let id = type === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
  }),

  newSubscriptionUrl: computed('isUser', 'login', function () {
    let isUser = this.get('isUser');
    let login = this.get('login');
    let id = isUser ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/new?id=${id}`;
  }),

  logMultipleSubscriptionsError() {
    const exception = new Error(`Account ${this.login} has more than one active subscription!`);
    this.raven.logException(exception, true);
  }
});
