import { isNone } from '@ember/utils';
import { get, computed } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';
import { alias, notEmpty, filter } from '@ember/object/computed';

export default Controller.extend({
  repoController: controller('repo'),
  tab: alias('repoController.tab'),
  repo: alias('repoController.repo'),

  defaultBranch: computed('model', function () {
    let model = this.model;
    return model.filterBy('default_branch')[0];
  }),

  branchesExist: notEmpty('model'),
  nonDefaultBranches: filter('model', (branch) => !branch.default_branch),

  activeBranches: computed('nonDefaultBranches', function () {
    let nonDefaultBranches = this.nonDefaultBranches;
    const activeBranches = nonDefaultBranches.filterBy('exists_on_github');
    return this._sortBranchesByFinished(activeBranches);
  }),

  inactiveBranches: computed('nonDefaultBranches', function () {
    let nonDefaultBranches = this.nonDefaultBranches;
    const inactiveBranches = nonDefaultBranches.filterBy('exists_on_github', false);
    return this._sortBranchesByFinished(inactiveBranches);
  }),

  _sortBranchesByFinished(branches) {
    const unfinished = branches.filter(branch => {
      const finishedAt = get(branch, 'last_build.finished_at');
      return isNone(finishedAt);
    });

    const sortedFinished = branches
      .filterBy('last_build.finished_at')
      .sortBy('last_build.finished_at')
      .reverse();

    return unfinished.concat(sortedFinished);
  }
});
