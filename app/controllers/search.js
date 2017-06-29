import Ember from 'ember';
import { alias } from 'ember-computed-decorators';

const { service, controller } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),
  tabStates: service(),
  statusImages: service(),

  repos: controller(),

  @alias('repos.repos.firstObject') repo: null,

  @alias('tabStates.mainTab') tab: null,

  @alias('repo.currentBuild') build: null,

  @alias('repo.currentBuild.jobs.firstObject') job: null,

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
});
