import AbstractBuildsRoute from 'travis/routes/abstract-builds';

export default AbstractBuildsRoute.extend({
  contentType: 'builds',

  model() {
    const repositoryId = this.modelFor('repo').get('id');
    return this.store.query('build', {
      event_type: ['push', 'cron'],
      repository_id: repositoryId
    }).then((builds) => {
      // additional filtering shouldn't be necessary, but we get PR's back for
      // some reason
      return builds.filterBy('isPullRequest', false);
    });
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('unorderedBuilds', model);
  }
});
