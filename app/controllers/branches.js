import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed('model', function () {
    const output = this.get('model').filter(function (item) {
      return item.default_branch;
    });
    if (output.length) {
      return output[0];
    }
  }),

  branchesExist: Ember.computed('model', function () {
    return this.get('model').length;
  }),

  activeBranches: Ember.computed('model', function () {
    const branches = this.get('model');
    return this._sortBranchesByCreatedOrFinished(branches.filter(function (item) {
      return item.exists_on_github && !item.default_branch;
    }));
  }),

  inactiveBranches: Ember.computed('model', function () {
    const branches = this.get('model');
    return this._sortBranchesByCreatedOrFinished(branches.filter(function (item) {
      return !item.exists_on_github && !item.default_branch;
    }));
  }),

  // Created branches are sorted first, then by finished_at.
  _sortBranchesByCreatedOrFinished(branches) {
    const sortedByFinishedAt = branches.sortBy('last_build.finished_at').reverse();

    const createdAndNot = sortedByFinishedAt.reduce((createdAndNot, branch) => {
      if (Ember.get(branch, 'last_build.state') === 'created') {
        createdAndNot.created.push(branch);
      } else {
        createdAndNot.notCreated.push(branch);
      }

      return createdAndNot;
    }, { created: [], notCreated: [] });

    return createdAndNot.created.concat(createdAndNot.notCreated);
  }
});
