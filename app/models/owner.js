import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import dynamicQuery from 'travis/utils/dynamic-query';

const { profileReposPerPage: limit } = config.pagination;

export default Model.extend({
  features: service(),
  accounts: service(),
  raven: service(),

  name: attr('string'),
  login: attr('string'),
  isSyncing: attr('boolean'),
  syncedAt: attr(),
  avatarUrl: attr('string'),
  githubId: attr('string'),
  education: attr('boolean'),

  // This is set by serializers:subscription
  subscriptionPermissions: attr(),

  installation: belongsTo('installation', { async: false }),

  githubAppsRepositories: dynamicQuery(function* ({ page = 1, filter = '' }) {
    return yield this.fetchRepositories({ page, filter, ghApps: true, onOrg: false });
  }),

  githubAppsRepositoriesOnOrg: dynamicQuery(function* ({ page = 1, filter = '' }) {
    return yield this.fetchRepositories({ page, filter, ghApps: true, onOrg: true });
  }),

  webhooksRepositories: dynamicQuery(function* ({ page = 1, filter = '' }) {
    return yield this.fetchRepositories({ page, filter, ghApps: false });
  }),

  fetchRepositories({ page, filter, ghApps, onOrg }) {
    const offset = (page - 1) * limit;
    const owner = this.login;
    const type = 'byOwner';
    const isGhAppsEnabled = !!this.features.get('github-apps');

    return ghApps && !isGhAppsEnabled ? [] : this.store.paginated('repo', {
      'repository.managed_by_installation': ghApps,
      'repository.active_on_org': onOrg,
      'repository.active': isGhAppsEnabled && !onOrg ? true : undefined,
      sort_by: 'name',
      name_filter: filter,
      limit, offset, custom: { owner, type, },
    }, { live: false });
  },

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
