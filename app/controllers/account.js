import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed, action } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Controller.extend({
  filtering: false,

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

  @action
  filterQuery(query) {
    return this.get('store')
      .query('repo', {
        slug_matches: query,
        sort_by: 'slug_match:desc',
        limit: 10,
        custom: {
          owner: this.get('model.account.login'),
          type: 'byOwner',
        },
      });
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
