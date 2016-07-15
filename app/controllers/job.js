import Ember from 'ember';
import { githubCommit } from 'travis/utils/urls';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  auth: service(),
  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  currentUser: alias('auth.currentUser'),
  tab: alias('repoController.tab'),

  urlGithubCommit: function() {
    return githubCommit(this.get('repo.slug'), this.get('commit.sha'));
  }.property('repo.slug', 'commit.sha'),

  jobStateDidChange: function() {
    return this.send('faviconStateDidChange', this.get('job.state'));
  }.observes('job.state')
});
