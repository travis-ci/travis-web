import Ember from 'ember';
import GithubUrlProperties from 'travis/mixins/github-url-properties';

const { controller } = Ember.inject;

export default Ember.Controller.extend(GithubUrlProperties, {
  repoController: controller('repo'),
  repoBinding: 'repoController.repo',
  commitBinding: 'build.commit',
  currentUserBinding: 'auth.currentUser',
  tabBinding: 'repoController.tab',
  sendFaviconStateChanges: true,
  currentItemBinding: 'build',

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
