import TravisRoute from 'travis/routes/basic';

const mixins = [];

export default TravisRoute.extend(...mixins, {
  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('repo').activate('builds');
  },

  titleToken() {
    return 'Builds';
  },

  model() {
    return this.modelFor('repo').get('builds');
  },
});
