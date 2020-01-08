import { isNone } from '@ember/utils';
import { get, computed } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';
import {
  alias,
  filter,
  filterBy,
  notEmpty,
  reads
} from '@ember/object/computed';

export default Controller.extend({
  repoController: controller('repo'),
  tab: alias('repoController.tab'),

  defaultBranches: filterBy('model', 'default_branch'),
  defaultBranch: reads('defaultBranches.firstObject'),
  nonDefaultBranches: filter('model', (branch) => !branch.default_branch),

  branchesExist: notEmpty('model'),

  activeBranches: computed('nonDefaultBranches.[]', function () {
    const activeBranches = this.nonDefaultBranches.filterBy('exists_on_github');
    return this._sortBranchesByFinished(activeBranches);
  }),

  inactiveBranches: computed('nonDefaultBranches.[]', function () {
    const inactiveBranches = this.nonDefaultBranches.filterBy('exists_on_github', false);
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
