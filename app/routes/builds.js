import TravisRoute from 'travis/routes/basic';

const mixins = [];

export default TravisRoute.extend(...mixins, {
  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('repo').activate(this.get('contentType'));
  },

  titleToken() {
    return 'Builds';
  },

  model() {
    return this.modelFor('repo').get('builds');
  },

  contentType: 'builds',
});
