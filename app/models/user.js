/* global Travis */
import Owner from 'travis/models/owner';

import ArrayProxy from '@ember/array/proxy';

import { next, run, later } from '@ember/runloop';
import { observer } from '@ember/object';
import config from 'travis/config/environment';
import attr from 'ember-data/attr';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default Owner.extend({
  @service ajax: null,
  // TODO: this totally not should be needed here
  @service sessionStorage: null,

  email: attr(),
  token: attr(),
  gravatarId: attr(),

  @computed('name', 'login')
  fullName(name, login) {
    return name || login;
  },

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

  @computed('login')
  urlGithub(login) {
    return `${config.sourceEndpoint}/${login}`;
  },

  @computed()
  _rawPermissions() {
    return this.get('ajax').get('/users/permissions');
  },

  @computed('_rawPermissions')
  permissions(_rawPermissions) {
    let permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.permissions));
    return permissions;
  },

  @computed('_rawPermissions')
  adminPermissions(_rawPermissions) {
    let permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.admin));
    return permissions;
  },

  @computed('_rawPermissions')
  pullPermissions(_rawPermissions) {
    const permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.pull));
    return permissions;
  },

  @computed('_rawPermissions')
  pushPermissions(_rawPermissions) {
    const permissions = ArrayProxy.create({
      content: []
    });
    _rawPermissions.then(data => permissions.set('content', data.push));
    return permissions;
  },

  @computed('_rawPermissions')
  pushPermissionsPromise(_rawPermissions) {
    return _rawPermissions.then(data => data.pull);
  },

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

  type: 'user',

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

  setWithSession(name, value) {
    let user;
    this.set(name, value);
    user = JSON.parse(this.get('sessionStorage').getItem('travis.user'));
    user[name.underscore()] = this.get(name);
    return this.get('sessionStorage').setItem('travis.user', JSON.stringify(user));
  }
});
