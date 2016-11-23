import AbstractBuildsRoute from 'travis/routes/abstract-builds';

export default AbstractBuildsRoute.extend({
  contentType: 'pull_requests',

  model() {
    const repositoryId = this.modelFor('repo').get('id');
    return this.store.query('build', {
      event_type: ['pull_request'],
      repository_id: repositoryId
    }).then((builds) => {
      return builds.filterBy('isPullRequest', true);
    });
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('model', model);
    controller.set('unorderedBuilds', model);
    controller.set('isLoaded', true);
  },
});
