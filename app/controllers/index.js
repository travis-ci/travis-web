import Ember from 'ember';
import computed, { alias } from 'ember-computed-decorators';
import Visibility from 'npm:visibilityjs';
import config from 'travis/config/environment';

const { service, controller } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),
  tabStates: service(),
  updateTimesService: service('updateTimes'),
  statusImages: service(),
  popup: service(),

  repos: controller(),

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    this.get('updateTimesService').push(this.get('build.stages'));
    this.get('updateTimesService').push(this.get('build.jobs'));
  },

  @computed('features.proVersion')
  landingPage(pro) {
    let version = pro ? 'pro' : 'default';

    return `landing/${version}-page`;
  },

  @computed('repo.slug', 'repo.defaultBranch.name')
  statusImageUrl(slug, branchName) {
    return this.get('statusImages').imageUrl(slug, branchName);
  },

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

  actions: {
    statusImages() {
      this.get('popup').open('status-images');
      return false;
    }
  },

});
