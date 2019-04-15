/* global Travis */
import Owner from 'travis/models/owner';

import ArrayProxy from '@ember/array/proxy';

import { next, run, later } from '@ember/runloop';
import { observer, computed } from '@ember/object';
import config from 'travis/config/environment';
import attr from 'ember-data/attr';
import { inject as service } from '@ember/service';

export default Owner.extend({
  ajax: service(),
  // TODO: this totally not should be needed here
  sessionStorage: service(),

  email: attr(),
  emails: attr(), // list of all known user emails
  token: attr(),
  gravatarId: attr(),
  allowMigration: attr(),


  type: 'user',
  isUser: true,

  fullName: computed('name', 'login', function () {
    let name = this.get('name');
    let login = this.get('login');
    return name || login;
  }),

  init() {
    this.isSyncingDidChange();
    return this._super(...arguments);
  },

  isSyncingDidChange: observer('isSyncing', function () {
    return next(this, function () {
      if (this.get('isSyncing')) {
        return this.poll();
      }
    });
  }),

  urlGithub: computed('login', function () {
    let login = this.get('login');
    return `${config.sourceEndpoint}/${login}`;
  }),

  _rawPermissions: computed(function () {
    return this.get('ajax').get('/users/permissions');
  }),

  permissions: computed('_rawPermissions', function () {
    let _rawPermissions = this.get('_rawPermissions');
    let permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.permissions));
    return permissions;
  }),

  adminPermissions: computed('_rawPermissions', function () {
    let _rawPermissions = this.get('_rawPermissions');
    let permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.admin));
    return permissions;
  }),

  pullPermissions: computed('_rawPermissions', function () {
    let _rawPermissions = this.get('_rawPermissions');
    const permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.pull));
    return permissions;
  }),

  pushPermissions: computed('_rawPermissions', function () {
    let _rawPermissions = this.get('_rawPermissions');
    const permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.push));
    return permissions;
  }),

  pushPermissionsPromise: computed('_rawPermissions', function () {
    let _rawPermissions = this.get('_rawPermissions');
    return _rawPermissions.then(data => data.pull);
  }),

  hasAccessToRepo(repo) {
    let id = repo.get ? repo.get('id') : repo;
    let permissions = this.get('permissions');
    if (permissions) {
      return permissions.includes(parseInt(id));
    }
  },

  hasPullAccessToRepo(repo) {
    const id = repo.get ? repo.get('id') : repo;
    const permissions = this.get('pullPermissions');
    if (permissions) {
      return permissions.includes(parseInt(id));
    }
  },

  hasPushAccessToRepo(repo) {
    const id = repo.get ? repo.get('id') : repo;
    const permissions = this.get('pushPermissions');
    if (permissions) {
      return permissions.includes(parseInt(id));
    }
  },

  sync() {
    const callback = run(() => { this.setWithSession('isSyncing', true); });
    return this.get('ajax').postV3(`/user/${this.id}/sync`, {}, callback);
  },

  poll() {
    return this.get('ajax').getV3('/user', (data) => {
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
    const organizations = orgs.mapBy('id');
    return this.ajax.postV3(`/user/${this.id}/beta_migration_request`, { organizations })
      .then(() => this.fetchBetaMigrationRequests());
  },

  setWithSession(name, value) {
    let user;
    this.set(name, value);
    user = JSON.parse(this.get('sessionStorage').getItem('travis.user'));
    user[name.underscore()] = this.get(name);
    return this.get('sessionStorage').setItem('travis.user', JSON.stringify(user));
  }
});
