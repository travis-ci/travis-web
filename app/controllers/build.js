import Ember from 'ember';
import GithubUrlProperties from 'travis/mixins/github-url-properties';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend(GithubUrlProperties, {
  auth: service(),
  repoController: controller('repo'),

  repo: alias('repoController.repo'),
  currentUser: alias('auth.currentUser'),
  tab: alias('repoController.tab'),
  sendFaviconStateChanges: true,

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
  })
});
