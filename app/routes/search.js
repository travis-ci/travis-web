import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Route.extend({
  tabStates: service(),

  renderTemplate() {
    this._super(...arguments);

    this.render('repos', {
      into: 'search',
      outlet: 'left',
    });
  },

  activate() {
    this.get('tabStates').set('sidebarTab', 'search');
    this._super(...arguments);
  },

  setupController(controller, searchPhrase) {
    this._super(...arguments);
    this.controllerFor('repos').activate('search', searchPhrase);
  },

  model(params) {
    return params.phrase.replace(/%2F/g, '/');
  },

  deactivate() {
    this._super(...arguments);
    return this.controllerFor('repos').set('search', void 0);
  },
});
