/* global Travis */
import { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Owner from 'travis/models/owner';
import config from 'travis/config/environment';
import { or, reads } from '@ember/object/computed';

export default Owner.extend({
  api: service(),
  accounts: service(),
  features: service(),
  permissionsService: service('permissions'),
  wizardStateService: service('wizardState'),

  email: attr('string'),
  emails: attr(), // list of all known user emails
  token: attr('string'),
  secureUserHash: attr('string'),
  gravatarId: attr('string'),
  firstLoggedInAt: attr('date'),
  allowMigration: attr('boolean'),
  recentlySignedUp: attr('boolean'),
  channels: attr(),
  authToken: attr('string'),
  rssToken: attr('string'),
  webToken: attr('string'),
  utmParams: attr(),
  confirmedAt: attr('date'),
  customKeys: attr(),
  collaborator: attr('boolean'),

  type: 'user',

  fullName: or('name', 'login'),
  applyFilterRepos: false,

  gravatarUrl: computed('gravatarId', function () {
    return `https//www.gravatar.com/avatar/${this.gravatarId}?s=48&d=mm`;
  }),

  init() {
    this.schedulePoll();
    return this._super(...arguments);
  },

  permissions: reads('permissionsService.all'),
  adminPermissions: reads('permissionsService.admin'),
  pullPermissions: reads('permissionsService.pull'),
  pushPermissions: reads('permissionsService.push'),
  wizardState: reads('wizardStateService.state'),

  hasAccessToRepo(repo) {
    let id = repo.get ? repo.get('id') : repo;
    let permissions = this.permissions;
    if (permissions) {
      return permissions.includes(parseInt(id));
    }
  },

  hasPullAccessToRepo(repo) {
    const id = repo.get ? repo.get('id') : repo;
    const permissions = this.pullPermissions;
    if (permissions) {
      return permissions.includes(parseInt(id));
    }
  },

  hasPushAccessToRepo(repo) {
    const id = repo.get ? repo.get('id') : repo;
    const permissions = this.pushPermissions;
    if (permissions) {
      return permissions.includes(parseInt(id));
    }
  },

  hasPermissionToRepo(repo, permission) {
    let permissions = repo.get ? repo.get('permissions') : null;
    if (permissions) {
      return permissions[permission] || false;
    }
  },

  sync(isOrganization) {
    this.set('isSyncing', true);
    this.set('applyFilterRepos', !isOrganization);
    return this.api
      .post(`/user/${this.id}/sync`)
      .then(() => this.poll());
  },

  schedulePoll() {
    later(
      () => this.isSyncing && this.poll(),
      config.intervals.syncingPolling
    );
  },

  poll() {
    return this.reload().then(() => {
      if (this.isSyncing) {
        this.schedulePoll();
      } else {
        const enterprise = !!this.get('features.enterpriseVersion');
        this.permissionsService.fetchPermissions.perform();
        if (!enterprise) {
          this.wizardStateService.fetch.perform();
        }
        this.accounts.fetchOrganizations.perform();

        if (!enterprise) {
          this.accounts.fetchSubscriptions.perform();
          this.accounts.fetchV2Subscriptions.perform();
        }

        this.applyReposFilter();
        Travis.trigger('user:synced', this);
        this.set('isSyncing', false);
      }
    });
  },

  joinMigrateBeta(orgs = []) {
    const organizations = orgs.mapBy('login');
    return this.api.post(`/user/${this.id}/beta_migration_request`, { data: { organizations } })
      .then(() => this.fetchBetaMigrationRequests());
  },

  reload(options = {}) {
    const { webToken } = this;
    let res = this.store.queryRecord('user', Object.assign({}, options, { current: true, webToken }));
    return res;
  },

  applyReposFilter() {
    if (this.applyFilterRepos) {
      const filterTerm = this.get('githubAppsRepositories.filterTerm');
      return this.githubAppsRepositories.applyFilter(filterTerm || '');
    }
  },
});
