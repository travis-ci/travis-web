import Ember from 'ember';
import { controller } from 'ember-decorators/controller';
import { computed } from 'ember-decorators/object';
import { alias, notEmpty, filter } from 'ember-decorators/object/computed';

export default Ember.Controller.extend({
  @controller('repo') repoController: null,

  @alias('repoController.tab') tab: null,

  @computed('model')
  defaultBranch(model) {
    return model.filterBy('default_branch')[0];
  },

  @notEmpty('model') branchesExist: null,

  @filter('model', function (branch, index, array) {
    return !branch.default_branch;
  })  nonDefaultBranches: null,

  @computed('nonDefaultBranches')
  activeBranches(nonDefaultBranches) {
    const activeBranches = nonDefaultBranches.filterBy('exists_on_github');
    return this._sortBranchesByFinished(activeBranches);
  },

  @computed('nonDefaultBranches')
  inactiveBranches(nonDefaultBranches) {
    const inactiveBranches = nonDefaultBranches.filterBy('exists_on_github', false);
    return this._sortBranchesByFinished(inactiveBranches);
  },

  _sortBranchesByFinished(branches) {
    const unfinished = branches.filter(branch => {
      return Ember.isNone(Ember.get(branch, 'last_build.finished_at'));
    });
    const sortedFinished = branches.filterBy('last_build.finished_at')
      .sortBy('last_build.finished_at').reverse();

    return unfinished.concat(sortedFinished);
  }
});
