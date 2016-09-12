/* global Travis */
import Ember from 'ember';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  auth: service(),
  allHooks: [],
  user: alias('auth.currentUser'),

  init() {
    this._super(...arguments);

    return Travis.on('user:synced', (() => {
      return this.reloadHooks();
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
    let login = this.get('model.login');
    if (login) {
      let hooks = this.store.query('hook', {
        all: true,
        owner_name: login
      });
      hooks.then(function () {
        return hooks.set('isLoaded', true);
      });
      return this.set('allHooks', hooks);
    }
  },

  accountName: Ember.computed('model.name', 'model.login', function () {
    return this.get('model.name') || this.get('model.login');
  }),

  hooks: Ember.computed('allHooks.length', 'allHooks', function () {
    let hooks = this.get('allHooks');
    if (!hooks) {
      this.reloadHooks();
    }
    return this.get('allHooks').filter(function (hook) {
      return hook.get('admin');
    });
  }),

  hooksWithoutAdmin: Ember.computed('allHooks.length', 'allHooks', function () {
    let hooks = this.get('allHooks');
    if (!hooks) {
      this.reloadHooks();
    }
    return this.get('allHooks').filter(function (hook) {
      return !hook.get('admin');
    });
  }),

  showPrivateReposHint: Ember.computed(function () {
    return this.config.show_repos_hint === 'private';
  }),

  showPublicReposHint: Ember.computed(function () {
    return this.config.show_repos_hint === 'public';
  }),

  billingUrl: Ember.computed('model.name', 'model.login', function () {
    var id;
    id = this.get('model.type') === 'user' ? 'user' : this.get('model.login');
    return this.config.billingEndpoint + '/subscriptions/' + id;
  }),

  subscribeButtonInfo: Ember.computed('model.login', 'model.type', function () {
    return {
      billingUrl: this.get('billingUrl'),
      subscribed: this.get('model.subscribed'),
      education: this.get('model.education')
    };
  })
});
