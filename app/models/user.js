/* global Travis */
import { attr } from '@ember-data/model';
import { observer, computed } from '@ember/object';
import { next, run, later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ArrayProxy from '@ember/array/proxy';
import Owner from 'travis/models/owner';
import config from 'travis/config/environment';

export default Owner.extend({
  ajax: service(),
  // TODO: this totally not should be needed here
  sessionStorage: service(),

  email: attr('string'),
  emails: attr(), // list of all known user emails
  token: attr(),
  gravatarId: attr(),
  allowMigration: attr('boolean'),


  type: 'user',

  fullName: computed('name', 'login', function () {
    let name = this.name;
    let login = this.login;
    return name || login;
  }),

  init() {
    this.isSyncingDidChange();
    return this._super(...arguments);
  },

  isSyncingDidChange: observer('isSyncing', function () {
    return next(this, function () {
      if (this.isSyncing) {
        return this.poll();
      }
    });
  }),

  urlGithub: computed('login', function () {
    let login = this.login;
    return `${config.sourceEndpoint}/${login}`;
  }),

  _rawPermissions: computed(function () {
    return this.ajax.get('/users/permissions');
  }),

  permissions: computed('_rawPermissions', function () {
    let _rawPermissions = this._rawPermissions;
    let permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.permissions));
    return permissions;
  }),

  adminPermissions: computed('_rawPermissions', function () {
    let _rawPermissions = this._rawPermissions;
    let permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.admin));
    return permissions;
  }),

  pullPermissions: computed('_rawPermissions', function () {
    let _rawPermissions = this._rawPermissions;
    const permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.pull));
    return permissions;
  }),

  pushPermissions: computed('_rawPermissions', function () {
    let _rawPermissions = this._rawPermissions;
    const permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.push));
    return permissions;
  }),

  pushPermissionsPromise: computed('_rawPermissions', function () {
    let _rawPermissions = this._rawPermissions;
    return _rawPermissions.then(data => data.pull);
  }),

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

  sync() {
    const callback = run(() => { this.setWithSession('isSyncing', true); });
    return this.ajax.postV3(`/user/${this.id}/sync`, {}, callback);
  },

  poll() {
    return this.ajax.getV3('/user', (data) => {
      if (data.is_syncing) {
        return later(() => { this.poll(); }, config.intervals.syncingPolling);
      } else {
        run(() => {
          this.set('isSyncing', false);
          this.setWithSession('syncedAt', data.synced_at);
          Travis.trigger('user:synced', data);
          this.store.queryRecord('user', { current: true });
        });
      }
    });
  },

  joinMigrateBeta(orgs = []) {
    const organizations = orgs.mapBy('login');
    return this.ajax.postV3(`/user/${this.id}/beta_migration_request`, { organizations })
      .then(() => this.fetchBetaMigrationRequests());
  },

  setWithSession(name, value) {
    let user;
    this.set(name, value);
    user = JSON.parse(this.sessionStorage.getItem('travis.user'));
    user[name.underscore()] = this.get(name);
    return this.sessionStorage.setItem('travis.user', JSON.stringify(user));
  }
});
