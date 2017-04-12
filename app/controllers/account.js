/* global Travis */
import Ember from 'ember';
import computed, { alias } from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),
  allHooks: [],

  @alias('auth.currentUser') user: null,

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
        owner_name: login,
        order: 'none'
      });
      this.set('loadingError', false);
      hooks.then(function () {
        return hooks.set('isLoaded', true);
      }).catch(() => {
        this.set('loadingError', true);
      });
      return this.set('allHooks', hooks);
    }
  },

  @computed('model.{name,login}')
  accountName(name, login) {
    return name || login;
  },

  @computed('allHooks.[]')
  hooks(hooks) {
    if (!hooks) {
      this.reloadHooks();
    }
    return hooks.filter(function (hook) {
      return hook.get('admin');
    }).sortBy('name');
  },

  @computed('allHooks.[]')
  hooksWithoutAdmin(hooks) {
    if (!hooks) {
      this.reloadHooks();
    }
    return this.get('allHooks').filter(function (hook) {
      return !hook.get('admin');
    }).sortBy('name');
  },

  showPrivateReposHint: Ember.computed(function () {
    return this.config.show_repos_hint === 'private';
  }),

  showPublicReposHint: Ember.computed(function () {
    return this.config.show_repos_hint === 'public';
  }),

  @computed('model.{type,login}')
  billingUrl(type, login) {
    const id = type === 'user' ? 'user' : login;
    return this.config.billingEndpoint + '/subscriptions/' + id;
  },

  @computed('model.{subscribed,education}', 'billingUrl')
  subscribeButtonInfo(subscribed, education, billingUrl) {
    return {
      billingUrl,
      subscribed,
      education,
    };
  }
});
