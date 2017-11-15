import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { computed, action } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service auth: null,
  @service externalLinks: null,

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

  @computed()
  showPrivateReposHint() {
    return this.config.show_repos_hint === 'private';
  },

  @computed()
  showPublicReposHint() {
    return this.config.show_repos_hint === 'public';
  },

  @computed('model.{type,login}')
  billingUrl(type, login) {
    const id = type === 'user' ? 'user' : login;
    return `${this.config.billingEndpoint}/subscriptions/${id}`;
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
