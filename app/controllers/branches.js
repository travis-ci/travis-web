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
    return this._sortBranchesByCreatedOrFinished(repos.filter(function (item) {
      return item.exists_on_github && !item.default_branch;
    }));
  }),

  inactiveBranches: Ember.computed('model', function () {
    var repos;
    repos = this.get('model');
    return this._sortBranchesByCreatedOrFinished(repos.filter(function (item) {
      return !item.exists_on_github && !item.default_branch;
    }));
  }),

  // Created branches are sorted first, then by finished_at.
  _sortBranchesByCreatedOrFinished(repos) {
    return repos.sort((a, b) => {
      console.log(`a: ${Ember.get(a, 'name')} at ${Ember.get(a, 'last_build.finished_at')}`);
      console.log(`b: ${Ember.get(b, 'name')} at ${Ember.get(b, 'last_build.finished_at')}`);
      if (Ember.get(a, 'last_build.state') === 'created') {
        console.log('returning -Infinity for ' + Ember.get(a, 'name'));

        return -Infinity;
      } else {
        // console.log("returning " + (Ember.get(a, 'last_build.finished_at') || Infinity) + ' for ' + Ember.get(a, 'name'));

        return (Ember.get(b, 'last_build.finished_at') || Infinity) - (Ember.get(a, 'last_build.finished_at') || Infinity);
      }
    });
  }
});
