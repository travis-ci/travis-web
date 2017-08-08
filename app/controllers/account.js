/* global Travis */
import Ember from 'ember';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed, action } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Controller.extend({
  @service auth: null,

  allHooks: [],

  @alias('auth.currentUser') user: null,

  init() {
    this._super(...arguments);

    return Travis.on('user:synced', () => { this.reloadHooks(); });
  },


  @action
  sync() {
    return this.get('user').sync();
  },

  @action
  toggle(hook) {
    return hook.toggle();
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
      hooks.then(() => {
        hooks.set('isLoaded', true);
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
    return hooks.filter(hook => hook.get('admin')).sortBy('name');
  },

  @computed('allHooks.[]')
  hooksWithoutAdmin(hooks) {
    if (!hooks) {
      this.reloadHooks();
    }
    return hooks.filter(hook => !hook.get('admin')).sortBy('name');
  },

  @computed('model.{type,login}')
  billingUrl(type, login) {
    const id = type === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
  },

  @computed('billingUrl', 'model.{subscribed,education}')
  subscribeButtonInfo(billingUrl, subscribed, education) {
    return {
      billingUrl,
      subscribed,
      education,
    };
  },
});
