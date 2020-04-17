import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  router: service(),

  titleToken: model => `Job #${model.number}`,

  serialize: ({ id }) => ({
    job_id: id
  }),

  model(params) {
    return this.store.findRecord('job', params.job_id);
  },

  afterModel(job) {
    const { slug } = this.modelFor('repo');
    this.ensureJobOwnership(job, slug);
    return job
      .get('build.request')
      .then(request => request && request.fetchMessages.perform());
  },

  setupController(controller, job) {
    const repo = this.modelFor('repo');
    this.controllerFor('repo').setProperties({ job });
    controller.setProperties({ repo, job });
  },

  activate() {
    this.controllerFor('repo').activate('job');
  },

  ensureJobOwnership(job, urlSlug) {
    const jobSlug = job.get('repositorySlug') || job.get('repo.slug');
    const repoVcsSlug = job.get('repo.vcsSlug');
    if (jobSlug !== urlSlug && repoVcsSlug !== urlSlug) {
      throw new Error('invalidJobId');
    }
  },
});
