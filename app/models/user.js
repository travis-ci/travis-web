/* global Travis */
import Ember from 'ember';
import Model from 'ember-data/model';
import config from 'travis/config/environment';
import attr from 'ember-data/attr';
import { gravatarImage } from '../utils/urls';

const { service } = Ember.inject;

export default Model.extend({
  ajax: service(),

  // TODO: this totally not should be needed here
  sessionStorage: service(),

  name: attr(),
  email: attr(),
  login: attr(),
  token: attr(),
  gravatarId: attr(),
  isSyncing: attr('boolean'),
  syncedAt: attr(),
  repoCount: attr('number'),

  fullName: Ember.computed('name', 'login', function () {
    return this.get('name') || this.get('login');
  }),

  isSyncingDidChange: Ember.observer('isSyncing', function () {
    return Ember.run.next(this, function () {
      if (this.get('isSyncing')) {
        return this.poll();
      }
    });
  }),

  urlGithub: Ember.computed(function () {
    return `${config.sourceEndpoint}/${this.get('login')}`;
  }),

  _rawPermissions: Ember.computed(function () {
    return this.get('ajax').get('/users/permissions');
  }),

  permissions: Ember.computed(function () {
    let permissions = Ember.ArrayProxy.create({
      content: []
    });
    this.get('_rawPermissions').then((data) => {
      permissions.set('content', data.permissions);
    });
    return permissions;
  }),

  adminPermissions: Ember.computed(function () {
    let permissions;
    permissions = Ember.ArrayProxy.create({
      content: []
    });
    this.get('_rawPermissions').then((data) => {
      permissions.set('content', data.admin);
    });
    return permissions;
  }),

  pullPermissions: Ember.computed(function () {
    let permissions;
    permissions = Ember.ArrayProxy.create({
      content: []
    });
    this.get('_rawPermissions').then((data) => {
      permissions.set('content', data.pull);
    });
    return permissions;
  }),

  pushPermissions: Ember.computed(function () {
    let permissions;
    permissions = Ember.ArrayProxy.create({
      content: []
    });
    this.get('_rawPermissions').then((data) => {
      permissions.set('content', data.push);
    });
    return permissions;
  }),

  pushPermissionsPromise: Ember.computed(function () {
    return this.get('_rawPermissions').then((data) => {
      data.pull;
    });
  }),

  hasAccessToRepo(repo) {
    let id = repo.get ? repo.get('id') : repo;
    let permissions = this.get('permissions');
    if (permissions) {
      return permissions.contains(parseInt(id));
    }
  },

  type: Ember.computed(() => 'user'),

  sync() {
    let self;
    self = this;
    return this.get('ajax').post('/users/sync', {}, () => self.setWithSession('isSyncing', true));
  },

  poll() {
    return this.get('ajax').get('/users', (data) => {
      let self;
      if (data.user.is_syncing) {
        self = this;
        return setTimeout(() => self.poll(), 3000);
      } else {
        this.set('isSyncing', false);
        this.setWithSession('syncedAt', data.user.synced_at);
        Travis.trigger('user:synced', data.user);
        return this.store.query('account', {});
      }
    });
  },

  setWithSession(name, value) {
    let user;
    this.set(name, value);
    user = JSON.parse(this.get('sessionStorage').getItem('travis.user'));
    user[name.underscore()] = this.get(name);
    return this.get('sessionStorage').setItem('travis.user', JSON.stringify(user));
  },

  avatarUrl: Ember.computed('email', function () {
    return gravatarImage(this.get('email'), 36);
  })
});
