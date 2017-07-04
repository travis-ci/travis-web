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
    console.log('activate search route');
    this.get('tabStates').set('sidebarTab', 'search');
    this._super(...arguments);
  },

  setupController(controller, searchPhrase) {
    this._super(...arguments);
    this.set('repositories.searchQuery', searchPhrase);
    this.get('repositories.performSearchRequest').perform(searchPhrase);
  },

  model(params) {
    console.log('in model');
    return params.phrase.replace(/%2F/g, '/');
  },

  deactivate() {
    console.log('deactivating');
    this._super(...arguments);
    this.set('repositories.searchQuery', undefined);
  },
});
