import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed('model', function () {
    let output, repos;
    repos = this.get('model');
    output = repos.filter(item => item.default_branch);
    if (output.length) {
      return output[0];
    }
  }),

  branchesExist: Ember.computed('model', function () {
    const branches = this.get('model');

    return branches.length;
  }),

  activeBranches: Ember.computed('model', function () {
    let repos;
    repos = this.get('model');
    return repos = repos.filter(item => {
      item.exists_on_github && !item.default_branch;
    }).sortBy('last_build.finished_at').reverse();
  }),

  inactiveBranches: Ember.computed('model', function () {
    let repos = this.get('model');
    return repos.filter(item => {
      !item.exists_on_github && !item.default_branch;
    }).sortBy('last_build.finished_at').reverse();
  })
});
