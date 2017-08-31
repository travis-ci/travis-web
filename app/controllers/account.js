/* global Travis */
import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed, action } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import Repository from 'travis/models/repo';

export default Ember.Controller.extend({
  @service auth: null,
  @service externalLinks: null,

  ownedRepositories: [],

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

  reloadOwnerRepositories() {
    const login = this.get('model.account.login');
    if (login) {
      this.set('ownedRepositories', []);
      this.set('loadingError', false);
      const repositories = Repository.fetchByOwner(this.store, login);
      return repositories.then(() => {
        const ownedRepositories = this.store.peekAll('repo').filterBy('owner.login', login);
        this.set('ownedRepositories', ownedRepositories);
        this.set('ownedRepositories.isLoaded', true);
      }).catch(() => {
        this.set('loadingError', true);
      });
    }
  },

  @computed('model.account.{name,login}')
  accountName(name, login) {
    return name || login;
  },

  @computed('ownedRepositories.[]')
  administerableRepositories(repositories) {
    if (!repositories) {
      this.reloadOwnerRepositories();
    }
    return repositories
      .filter(repo => repo.get('permissions.admin'))
      .sortBy('name');
  },

  @computed('ownedRepositories.[]')
  unadministerableRepositories(repositories) {
    if (!repositories) {
      this.reloadOwnerRepositories();
    }
    return repositories
      .filter(repo => !repo.get('permissions.admin'))
      .sortBy('name');
  },

  @computed()
  showPrivateReposHint() {
    return this.config.show_repos_hint === 'private';
  },

  @computed()
  showPublicReposHint() {
    return this.config.show_repos_hint === 'public';
  },

  @computed('model.account.{type,login}')
  billingUrl(type, login) {
    const id = type === 'user' ? 'user' : login;
    return `${this.config.billingEndpoint}/subscriptions/${id}`;
  },

  @computed('model.account.{subscribed,education}', 'billingUrl')
  subscribeButtonInfo(subscribed, education, billingUrl) {
    return {
      billingUrl,
      subscribed,
      education,
    };
  },
});
