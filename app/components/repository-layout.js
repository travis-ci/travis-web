import Ember from 'ember';
import computed from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Component.extend({
  statusImages: service(),

  @computed('repo.slug', 'repo.defaultBranch.name')
  statusImageUrl(slug, branchName) {
    return this.get('statusImages').imageUrl(slug, branchName);
  },

  @computed('build.jobs.@each.{config}')
  jobsLoaded(jobs) {
    if (jobs) {
      return jobs.isEvery('config');
    }
  },

  @computed('build.jobs.[]')
  noJobsError(jobs) {
    return jobs.length < 1;
  },

  actions: {
    statusImages() {
      this.get('popup').open('status-images');
      return false;
    }
  },
});
