import AbstractBuildsRoute from 'travis/routes/abstract-builds';

export default AbstractBuildsRoute.extend({
  contentType: 'builds',

  model() {
    console.log('model hook in builds route');
    const repositoryId = this.modelFor('repo').get('id');
    return this.store.query('build', {
      event_type: ['push', 'cron'],
      repository_id: repositoryId
    });
  },
});
