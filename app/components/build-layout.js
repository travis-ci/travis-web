import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @alias('build.jobs.firstObject') job: null,

  @computed('build.jobs.[]')
  noJobsError(jobs) {
    return jobs.get('length') === 0;
  },

  @alias('build.isLoading') loading: null,

  @computed('build.jobs.@each.config')
  jobsLoaded(jobs) {
    if (jobs) {
      return jobs.isEvery('config');
    }
  },

  buildStagesSort: ['number'],
  sortedBuildStages: Ember.computed.sort('build.stages', 'buildStagesSort')
});
