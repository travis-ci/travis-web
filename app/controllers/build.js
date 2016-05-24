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

  jobsLoaded: function() {
    var jobs;
    if (jobs = this.get('build.jobs')) {
      return jobs.isEvery('config');
    }
  }.property('build.jobs.@each.config'),

  loading: function() {
    return this.get('build.isLoading');
  }.property('build.isLoading'),

  buildStateDidChange: function() {
    if (this.get('sendFaviconStateChanges')) {
      return this.send('faviconStateDidChange', this.get('build.state'));
    }
  }.observes('build.state')
});
