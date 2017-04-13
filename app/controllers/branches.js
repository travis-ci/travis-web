import Ember from 'ember';
import { task } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  flashes: service(),

  defaultBranch: Ember.computed.filterBy('model.activeBranches', 'defaultBranch'),
  // I'd like to use rejectBy but it throws an error??
  nonDefaultBranches: Ember.computed.filter('model.activeBranches', function (branch) {
    return !branch.get('defaultBranch');
  }),

  fetchInactiveTask: task(function* (offset) {
    let repoId = this.get('defaultBranch.firstObject.repoId');
    let alreadyInactive = this.get('model.inactiveBranches') || [];

    try {
      yield this.get('store').query('branch', {
        repoId: repoId,
        existsOnGithub: false,
        offset: offset
      }).then((branches) => {
        this.set('model.inactiveBranches', alreadyInactive.pushObjects(branches.toArray()));
      });
    } catch (e) {
      this.get('flashes').error('There was an error fetching inactive branches.');
    }
  }),

  fetchActiveTask: task(function* (offset) {
    let repoId = this.get('defaultBranch.firstObject.repoId');
    let alreadyActive = this.get('nonDefaultBranches');

    try {
      yield this.get('store').query('branch', {
        repoId: repoId,
        existsOnGithub: true,
        offset: offset
      }).then((branches) => {
        this.set('model.activeBranches', alreadyActive.pushObjects(branches.toArray()));
      });
    } catch (e) {
      this.get('flashes').error('There was an error fetching active branches.');
    }
  }),

  canLoadMoreActive: Ember.computed(
    'model.activeBranches.[]',
    'model.activeBranchesCount',
    function () {
      return this.get('model.activeBranchesCount') === this.get('nonDefaultBranches.length');
    }),

  canLoadMoreInactive: Ember.computed(
    'model.inactiveBranches.[]',
    'model.inactiveBranchesCount',
    function () {
      return this.get('model.inactiveBranchesCount') === this.get('model.inactiveBranches.length');
    })
});
