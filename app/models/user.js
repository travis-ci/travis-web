import Ember from 'ember';
import Model from 'travis/models/model';
import config from 'travis/config/environment';

export default Model.extend({
  ajax: Ember.inject.service(),

  // TODO: this totally not should be needed here
  sessionStorage: Ember.inject.service(),

  name: DS.attr(),
  email: DS.attr(),
  login: DS.attr(),
  token: DS.attr(),
  gravatarId: DS.attr(),
  isSyncing: DS.attr('boolean'),
  syncedAt: DS.attr(),
  repoCount: DS.attr('number'),

  fullName: function() {
    return this.get('name') || this.get('login');
  }.property('name', 'login'),

  isSyncingDidChange: function() {
    return Ember.run.next(this, function() {
      if (this.get('isSyncing')) {
        return this.poll();
      }
    });
  }.observes('isSyncing'),

  urlGithub: function() {
    return config.sourceEndpoint + "/" + (this.get('login'));
  }.property(),

  _rawPermissions: function() {
    return this.get('ajax').get('/users/permissions');
  }.property(),

  permissions: function() {
    var permissions;
    permissions = Ember.ArrayProxy.create({
      content: []
    });
    this.get('_rawPermissions').then((function(_this) {
      return function(data) {
        return permissions.set('content', data.permissions);
      };
    })(this));
    return permissions;
  }.property(),

  adminPermissions: function() {
    var permissions;
    permissions = Ember.ArrayProxy.create({
      content: []
    });
    this.get('_rawPermissions').then(() => {
      return permissions.set('content', data.admin);
    });
    return permissions;
  }.property(),

  pullPermissions: function() {
    var permissions;
    permissions = Ember.ArrayProxy.create({
      content: []
    });
    this.get('_rawPermissions').then(() => {
      return permissions.set('content', data.pull);
    });
    return permissions;
  }.property(),

  pushPermissions: function() {
    var permissions;
    permissions = Ember.ArrayProxy.create({
      content: []
    });
    this.get('_rawPermissions').then(() => {
      return permissions.set('content', data.push);
    });
    return permissions;
  }.property(),

  pushPermissionsPromise: function() {
    return this.get('_rawPermissions').then(() => {
      return data.pull;
    });
  }.property(),

  hasAccessToRepo(repo) {
    var id, permissions;
    id = repo.get ? repo.get('id') : repo;
    if (permissions = this.get('permissions')) {
      return permissions.contains(parseInt(id));
    }
  },

  type: function() {
    return 'user';
  }.property(),

  sync() {
    var self;
    self = this;
    return this.get('ajax').post('/users/sync', {}, function() {
      return self.setWithSession('isSyncing', true);
    });
  },

  poll() {
    return this.get('ajax').get('/users', () => {
      var self;
      if (data.user.is_syncing) {
        self = this;
        return setTimeout(function() {
          return self.poll();
        }, 3000);
      } else {
        this.set('isSyncing', false);
        this.setWithSession('syncedAt', data.user.synced_at);
        Travis.trigger('user:synced', data.user);
        return this.store.query('account', {});
      }
    });
  },

  setWithSession(name, value) {
    var user;
    this.set(name, value);
    user = JSON.parse(this.get('sessionStorage').getItem('travis.user'));
    user[name.underscore()] = this.get(name);
    return this.get('sessionStorage').setItem('travis.user', JSON.stringify(user));
  }
});
