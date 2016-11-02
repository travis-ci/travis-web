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
    return this._sortBranchesByFinished(activeBranches);
  }),

  inactiveBranches: Ember.computed('model', function () {
    const inactiveBranches = this.get('nonDefaultBranches').filterBy('exists_on_github', false);
    return this._sortBranchesByFinished(inactiveBranches);
  }),

  _sortBranchesByFinished(branches) {
    const unfinished = branches.filter(branch => {
      return Ember.isNone(Ember.get(branch, 'last_build.finished_at'));
    });
    const sortedFinished = branches.filterBy('last_build.finished_at')
      .sortBy('last_build.finished_at').reverse();

    return unfinished.concat(sortedFinished);
  }
});
