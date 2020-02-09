import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, match, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),

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
  ),

  isConfig: match('router.currentRouteName', /config$/),
  isLog: not('isConfig'),

  routeName: computed('router.currentRouteName', function () {
    return this.get('router.currentRouteName');
  })
});
