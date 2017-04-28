import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    return this.modelFor('repo').get('pullRequests');
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('repo').activate('pull_requests');
  },

  titleToken() {
    return 'Pull Requests';
  },
});
