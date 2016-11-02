import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed('model', function () {
    return this.get('model').filterBy('default_branch')[0];
  }),

  branchesExist: Ember.computed.notEmpty('model'),
  nonDefaultBranches: Ember.computed.filter('model', function (branch) {
    return !branch.default_branch;
  }),

  activeBranches: Ember.computed('model', function () {
    const activeBranches = this.get('nonDefaultBranches').filterBy('exists_on_github');
    return this._sortBranchesByCreatedOrFinished(activeBranches);
  }),

  inactiveBranches: Ember.computed('model', function () {
    const inactiveBranches = this.get('nonDefaultBranches').filterBy('exists_on_github', false);
    return this._sortBranchesByCreatedOrFinished(inactiveBranches);
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
