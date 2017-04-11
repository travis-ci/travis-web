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
    try {
      yield this.get('store').query('branch', {
        repoId: repoId,
        existsOnGithub: false,
        offset: offset
      }).then((branches) => {
        this.set('model.deletedBranches', branches);
      });
    } catch (e) {
      this.get('flashes').error('Could not fetch inactive repos');
    }
  }),

  fetchActiveTask: task(function* (offset) {
    let repoId = this.get('defaultBranch.firstObject.repoId');
    let alreadyActive = this.get('nonDefaultBranches');

    yield this.get('store').query('branch', {
      repoId: repoId,
      existsOnGithub: true,
      offset: offset
    }).then((branches) => {
      this.set('nonDefaultBranches', alreadyActive.pushObjects(branches.toArray()));
    });
  })
});
