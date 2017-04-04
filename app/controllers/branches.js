import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed.filterBy('model.activeBranches', 'defaultBranch'),

  // I'd like to use rejectBy but it throws an error??
  nonDefaultBranches: Ember.computed.filter('model.activeBranches', function (branch) {
    return !branch.get('defaultBranch');
  }),

  actions: {
    fetchInactive(offset) {
      let repoId = this.get('defaultBranch.firstObject.repoId');

      return this.get('store').query('branch', {
        repoId: repoId,
        existsOnGithub: false,
        offset: offset
      }).then((branches) => {
        this.set('model.deletedBranches', branches);
      });
    },
    fetchActive(offset) {
      let repoId = this.get('defaultBranch.firstObject.repoId');
      let alreadyActive = this.get('nonDefaultBranches');

      return this.get('store').query('branch', {
        repoId: repoId,
        existsOnGithub: true,
        offset: offset
      }).then((branches) => {
        this.set('nonDefaultBranches', alreadyActive.pushObjects(branches.toArray()));
      });
    }
  }
});
