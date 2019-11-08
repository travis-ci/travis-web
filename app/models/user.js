/* global Travis */
import { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { run, later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ArrayProxy from '@ember/array/proxy';
import Owner from 'travis/models/owner';
import config from 'travis/config/environment';
import { or } from '@ember/object/computed';

export default Owner.extend({
  ajax: service(),
  api: service(),

  email: attr('string'),
  emails: attr(), // list of all known user emails
  token: attr('string'),
  secureUserHash: attr('string'),
  gravatarId: attr('string'),
  firstLoggedInAt: attr(),
  allowMigration: attr('boolean'),
  recentlySignedUp: attr(),

  type: 'user',

  fullName: or('name', 'login'),

  gravatarUrl: computed('gravatarId', function () {
    return `https//www.gravatar.com/avatar/${this.gravatarId}?s=48&d=mm`;
  }),

  init() {
    if (this.isSyncing) this.poll();
    return this._super(...arguments);
  },

  _rawPermissions: computed(function () {
    return this.ajax.get('/users/permissions', { lib: 'xhr' });
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
    return this.api
      .post(`/user/${this.id}/sync`, {})
      .then(() => this.poll());
  },

  poll() {
    return this.api.get('/user', (data) => {
      if (data.is_syncing) {
        later(
          () => this.poll(),
          config.intervals.syncingPolling
        );
      } else {
        run(() => {
          Travis.trigger('user:synced', data);
          this.reload();
        });
      }
    });
  },

  joinMigrateBeta(orgs = []) {
    const organizations = orgs.mapBy('login');
    return this.api.post(`/user/${this.id}/beta_migration_request`, { organizations })
      .then(() => this.fetchBetaMigrationRequests());
  },

  reload(options = {}) {
    return this.store.queryRecord('user', Object.assign({}, options, { current: true }));
  }

});
