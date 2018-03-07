import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { computed, action } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import config from 'travis/config/environment';

export default Controller.extend({
  @service auth: null,
  @service externalLinks: null,
  @service features: null,

  @alias('auth.currentUser') user: null,

  @action
  sync() {
    return this.get('user').sync();
  },

  @action
  toggle(hook) {
    return hook.toggle();
  },

  @computed('model.{name,login}')
  accountName(name, login) {
    return name || login;
  },

  @computed('model.{type,login}')
  billingUrl(type, login) {
    const id = type === 'user' ? 'user' : login;
    return `${config.billingEndpoint}/subscriptions/${id}`;
  },

  @computed('model.{subscribed,education}', 'billingUrl')
  subscribeButtonInfo(subscribed, education, billingUrl) {
    return {
      billingUrl,
      subscribed,
      education,
    };
  },
});
