import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  renderTemplate() {
    Ember.$('body').attr('id', 'home');

    this._super(...arguments);
  },

  actions: {
    showRepositories() {
      this.transitionTo('main.repositories');
    },

    viewSearchResults(query) {
      this.transitionTo('main.search', query);
    }
  }
});
