import Ember from 'ember';
import sortBranches from 'travis/utils/sort-branches';

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
    return sortBranches(activeBranches);
  }),

  inactiveBranches: Ember.computed('model', function () {
    const inactiveBranches = this.get('nonDefaultBranches').filterBy('exists_on_github', false);
    return sortBranches(inactiveBranches);
  })
});
