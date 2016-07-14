import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed('model', function () {
    var output, repos;
    repos = this.get('model');
    output = repos.filter(function (item) {
      return item.default_branch;
    });
    if (output.length) {
      return output[0];
    }
  }),

  branchesExist: Ember.computed('model', function () {
    var branches = this.get('model');

    return branches.length;
  }),

  activeBranches: Ember.computed('model', function () {
    var repos;
    repos = this.get('model');
    return repos = repos.filter(function (item) {
      return item.exists_on_github && !item.default_branch;
    }).sortBy('last_build.finished_at').reverse();
  }),

  inactiveBranches: Ember.computed('model', function () {
    var repos;
    repos = this.get('model');
    return repos = repos.filter(function (item) {
      return !item.exists_on_github && !item.default_branch;
    }).sortBy('last_build.finished_at').reverse();
  })
});
