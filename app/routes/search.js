import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Route.extend({
  tabStates: service(),
  auth: service(),
  repositories: service(),

  redirect() {
    if (!this.get('auth.signedIn')) {
      this.transitionTo('index');
    }
  },

  activate() {
    this.get('tabStates').set('sidebarTab', 'search');
    this._super(...arguments);
  },

  setupController(controller, searchPhrase) {
    this._super(...arguments);
    this.set('repositories.searchQuery', searchPhrase);
  },

  model(params) {
    return params.phrase.replace(/%2F/g, '/');
  },

  deactivate() {
    this._super(...arguments);
    this.set('repositories.searchQuery', undefined);
  },
});
