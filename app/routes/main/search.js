import Ember from 'ember';
import MainTabRoute from 'travis/routes/main-tab';

const { service } = Ember.inject;

export default MainTabRoute.extend({
  tabStates: service(),

  renderTemplate() {
    this.render('repo');
    return this.render('build', {
      into: 'repo'
    });
  },

  activate() {
    this.get('tabStates').set('sidebarTab', 'search');
    this._super(...arguments);
  },

  setupController(controller, searchPhrase) {
    this.controllerFor('repo').activate('index');
    this.controllerFor('repos').activate('search', searchPhrase);
    return this.setCurrentRepoObservers();
  },

  model(params) {
    return params.phrase.replace(/%2F/g, '/');
  },

  deactivate() {
    this._super(...arguments);
    return this.controllerFor('repos').set('search', void 0);
  }
});
