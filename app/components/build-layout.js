import { sort } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Component.extend({
  @alias('build.jobs.firstObject') job: null,

  @computed('build.jobs.[]')
  noJobsError(jobs) {
    return jobs.get('length') === 0;
  },

  @alias('build.isLoading') loading: null,

  @computed('build.jobs.@each.configLoaded', 'build.jobs.@each.isLoaded')
  jobsLoaded(jobs) {
    jobs.forEach((j) => j.get('config'));
    return jobs.isEvery('configLoaded') && jobs.isEvery('isLoaded');
  },

  buildStagesSort: ['number'],
  sortedBuildStages: sort('build.stages', 'buildStagesSort')
});
