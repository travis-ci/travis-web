import Ember from 'ember';
import GithubUrlProperties from 'travis/mixins/github-url-properties';

export default Ember.Controller.extend({
  defaultBranch: function() {
    var output, repos;
    repos = this.get('model');
    output = repos.filter(function(item, index) {
      return item.default_branch;
    });
    if (output.length) {
      return output[0];
    }
  }.property('model'),

  branchesExist: function() {
    var branches = this.get('model');

    return branches.length;
  }.property('model'),

  activeBranches: function() {
    var repos;
    repos = this.get('model');
    return repos = repos.filter(function(item, index) {
      return item.exists_on_github && !item.default_branch;
    }).sortBy('last_build.finished_at').reverse();
  }.property('model'),

  inactiveBranches: function() {
    var repos;
    repos = this.get('model');
    return repos = repos.filter(function(item, index) {
      return !item.exists_on_github && !item.default_branch;
    }).sortBy('last_build.finished_at').reverse();
  }.property('model')
});
