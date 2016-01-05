import Ember from 'ember';
import { githubCommit } from 'travis/utils/urls';

export default Ember.Controller.extend({
  repoController: Ember.inject.controller('repo'),
  repoBinding: 'repoController.repo',
  commitBinding: 'job.commit',
  currentUserBinding: 'auth.currentUser',
  tabBinding: 'repoController.tab',
  currentItemBinding: 'job',

  urlGithubCommit: function() {
    return githubCommit(this.get('repo.slug'), this.get('commit.sha'));
  }.property('repo.slug', 'commit.sha'),

  jobStateDidChange: function() {
    return this.send('faviconStateDidChange', this.get('job.state'));
  }.observes('job.state')
});
