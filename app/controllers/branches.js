import { isNone } from '@ember/utils';
import { get } from '@ember/object';
import Controller from '@ember/controller';
import { controller } from 'ember-decorators/controller';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  @service flashes: null,
  @controller('repo') repoController: null,
  @alias('repoController.tab') tab: null,
  @computed('model.activeBranches.pagination.total')
  totalActive(total) {
    return total -= 1;
  },
  @alias('model.deletedBranches.pagination.total') totalDeleted: null,

  @computed('totalActive', 'activeBranches.length')
  canLoadActive(total, current) {
    return current < (total -= 1);
  },

  @computed('totalDeleted', 'deletedBranches.length')
  canLoadDeleted(total, current) {
    return current < total;
  },

  isShowingDeleted: false,

  @computed('model.activeBranches.[]')
  defaultBranch(activeBranches) {
    return activeBranches.filterBy('defaultBranch').slice(0, 1);
  },

  @computed('model.deletedBranches.[]')
  deletedBranches(deletedBranches) {
    return deletedBranches;
  },

  _sortBranchesByFinished(branches) {
    const unfinished = branches.filter(branch => {
      const finishedAt = get(branch, 'last_build.finished_at');
      return isNone(finishedAt);

  @computed('model.activeBranches.[]')
  activeBranches(activeBranches) {
    return activeBranches.filter((branch) => !branch.get('defaultBranch'));
  },

  fetchDeletedTask: task(function* (offset) {
    let repoId = this.get('defaultBranch.firstObject.repoId');
    let alreadyDeleted = this.get('deletedBranches') || [];

    yield this.get('store').paginated('branch', {
      repoId: repoId,
      existsOnGithub: false,
      includeCommit: true,
      includeRecent: true,
      offset: offset
    }).then((branches) => {
      let newBranches = branches.toArray();
      this.set('deletedBranches', alreadyDeleted.pushObjects(newBranches).uniq());
    });
  }),

  fetchActiveTask: task(function* (offset) {
    let repoId = this.get('defaultBranch.firstObject.repoId');
    let alreadyActive = this.get('activeBranches');
    try {
      yield this.get('store').paginated('branch', {
        repoId: repoId,
        existsOnGithub: true,
        includeCommit: true,
        includeRecent: true,
        offset: offset
      }).then((branches) => {
        let newBranches = branches.toArray().filter((branch) => !branch.get('defaultBranch'));
        return this.set('activeBranches', alreadyActive.pushObjects(newBranches).uniq());
      });
    } catch (e) {
      this.get('flashes').error('There was an error fetching active branches.');
    }
  }),

  actions: {
    toggleDeletedBranchVisibility() {
      this.toggleProperty('isShowingDeleted');
      return false;
    }
  }
});
