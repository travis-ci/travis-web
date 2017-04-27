import TravisRoute from 'travis/routes/basic';

const mixins = [];

export default TravisRoute.extend(...mixins, {
  model() {
    return this.modelFor('repo').get('pullRequests');
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('repo').activate(this.get('contentType'));
    this.controllerFor('build').set('contentType', this.get('contentType'));
  },

  titleToken() {
    return 'Pull Requests';
  },

  path: 'repo.pullRequests',

  contentType: 'pull_requests',
});
