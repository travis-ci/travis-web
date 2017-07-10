import Ember from 'ember';

export default Ember.Component.extend({
  job: Ember.computed.alias('build.jobs.firstObject'),

  noJobsError: Ember.computed('build.jobs', function () {
    if (this.get('build.jobs.length') === 0) {
      return true;
    }
  }),

  loading: Ember.computed('build.isLoading', function () {
    return this.get('build.isLoading');
  }),

  jobsLoaded: Ember.computed('build.jobs.@each.config', function () {
    let jobs = this.get('build.jobs');
    if (jobs) {
      return jobs.isEvery('config');
    }
  }),

  buildStateDidChange: Ember.observer('build.state', function () {
    if (this.get('sendFaviconStateChanges')) {
      return this.send('faviconStateDidChange', this.get('build.state'));
    }
  }),

  buildStagesSort: ['number'],
  sortedBuildStages: Ember.computed.sort('build.stages', 'buildStagesSort')
});
