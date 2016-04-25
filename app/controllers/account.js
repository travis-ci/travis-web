import Ember from 'ember';

export default Ember.Controller.extend({
  allHooks: [],
  userBinding: 'auth.currentUser',

  init() {
    var self;
    this._super(...arguments);
    self = this;
    return Travis.on("user:synced", (function() {
      return self.reloadHooks();
    }));
  },

  actions: {
    sync() {
      return this.get('user').sync();
    },

    toggle(hook) {
      return hook.toggle();
    }
  },

  reloadHooks() {
    var hooks, login;
    if (login = this.get('model.login')) {
      hooks = this.store.query('hook', {
        all: true,
        owner_name: login
      });
      hooks.then(function() {
        return hooks.set('isLoaded', true);
      });
      return this.set('allHooks', hooks);
    }
  },

  accountName: function() {
    return this.get('model.name') || this.get('model.login');
  }.property('model.name', 'model.login'),

  hooks: function() {
    var hooks;
    if (!(hooks = this.get('allHooks'))) {
      this.reloadHooks();
    }
    return this.get('allHooks').filter(function(hook) {
      return hook.get('admin');
    });
  }.property('allHooks.length', 'allHooks'),

  hooksWithoutAdmin: function() {
    var hooks;
    if (!(hooks = this.get('allHooks'))) {
      this.reloadHooks();
    }
    return this.get('allHooks').filter(function(hook) {
      return !hook.get('admin');
    });
  }.property('allHooks.length', 'allHooks'),

  showPrivateReposHint: function() {
    return this.config.show_repos_hint === 'private';
  }.property(),

  showPublicReposHint: function() {
    return this.config.show_repos_hint === 'public';
  }.property(),

  billingUrl: function() {
    var id;
    id = this.get('model.type') === 'user' ? 'user' : this.get('model.login');
    return this.config.billingEndpoint + "/subscriptions/" + id;
  }.property('model.name', 'model.login'),

  subscribeButtonInfo: function() {
    return {
      billingUrl: this.get('billingUrl'),
      subscribed: this.get('model.subscribed'),
      education: this.get('model.education')
    };
  }.property('model.login', 'model.type')
});
