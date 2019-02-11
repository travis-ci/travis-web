import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  job: alias('build.jobs.firstObject'),

  noJobsError: computed('build.jobs.[]', function () {
    let jobs = this.get('build.jobs');
    return jobs.get('length') === 0;
  }),

  loading: alias('build.isLoading'),

  jobsLoaded: computed(
    'build.jobs.@each.{isConfigLoaded,isLoaded}',
    'build.stagesAreLoaded',
    function () {
      let jobs = this.get('build.jobs');
      let stagesAreLoaded = this.get('build.stagesAreLoaded');
      jobs.forEach((j) => j.get('config'));
      return jobs.isEvery('isLoaded') && jobs.isEvery('isConfigLoaded') && stagesAreLoaded;
    }
  )
});
