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

  @computed('build.jobs.@each.{isConfigLoaded,isLoaded}', 'build.stagesAreLoaded')
  jobsLoaded(jobs, stagesAreLoaded) {
    jobs.forEach((j) => j.get('config'));
    return jobs.isEvery('isLoaded') && jobs.isEvery('isConfigLoaded') && stagesAreLoaded;
  },
});
