import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import GithubUrlProperties from 'travis/mixins/github-url-properties';
import Visibility from 'npm:visibilityjs';
import config from 'travis/config/environment';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend(GithubUrlProperties, Polling, {
  auth: service(),
  repoController: controller('repo'),

  repo: alias('repoController.repo'),
  currentUser: alias('auth.currentUser'),
  tab: alias('repoController.tab'),
  sendFaviconStateChanges: true,

  updateTimesService: service('updateTimes'),

  updateTimes() {
    this.get('updateTimesService').push(this.get('build.stages'));
  },

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  noJobsError: Ember.computed('build.jobs', function () {
    if (this.get('build.jobs.length') === 0) {
      return true;
    }
  }),

  jobsLoaded: Ember.computed('build.jobs.@each.config', function () {
    let jobs = this.get('build.jobs');
    if (jobs) {
      return jobs.isEvery('config');
    }
  }),

  loading: Ember.computed('build.isLoading', function () {
    return this.get('build.isLoading');
  }),

  buildStateDidChange: Ember.observer('build.state', function () {
    if (this.get('sendFaviconStateChanges')) {
      return this.send('faviconStateDidChange', this.get('build.state'));
    }
  }),

  buildStagesSort: ['number'],
  sortedBuildStages: Ember.computed.sort('build.stages', 'buildStagesSort')
});
