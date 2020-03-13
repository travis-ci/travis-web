import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, match, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  routeName: reads('router.currentRouteName'),

  job: reads('build.jobs.firstObject'),

  noJobsError: computed('build.jobs.[]', function () {
    let jobs = this.get('build.jobs');
    return jobs.get('length') === 0;
  }),

  loading: reads('build.isLoading'),

  jobsLoaded: computed(
    'build.jobs.@each.{isConfigLoaded,isLoaded}',
    'build.stagesAreLoaded',
    function () {
      let jobs = this.get('build.jobs');
      let stagesAreLoaded = this.get('build.stagesAreLoaded');
      jobs.forEach((j) => j.get('config'));
      return jobs.isEvery('isLoaded') && jobs.isEvery('isConfigLoaded') && stagesAreLoaded;
    }
  ),

  isConfig: match('router.currentRouteName', /config$/),
  isLog: not('isConfig'),
});
