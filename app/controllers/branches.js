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
    const sortedByFinishedAt = repos.sortBy('last_build.finished_at').reverse();

    const createdAndNot = sortedByFinishedAt.reduce((createdAndNot, repo) => {
      if (Ember.get(repo, 'last_build.state') === 'created') {
        createdAndNot.created.push(repo);
      } else {
        createdAndNot.notCreated.push(repo);
      }

      return createdAndNot;
    }, { created: [], notCreated: [] });

    return createdAndNot.created.concat(createdAndNot.notCreated);
  }
});
