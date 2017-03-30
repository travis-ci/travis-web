import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed.filterBy('model.activeBranches', 'defaultBranch'),

  // I'd like to use rejectBy but it throws an error??
  nonDefaultBranches: Ember.computed.filter('model.activeBranches', function (branch) {
    return !branch.get('defaultBranch');
  }),

  actions: {
    fetchInactive() {
      let repoId = this.get('defaultBranch.firstObject.repoId');
      return this.set('model.deletedBranches', this.get('store').query('branch', {
        repository_id: repoId,
        exists_on_github: false
      }));
    },
    fetchActive(offset) {
      let repoId = this.get('defaultBranch.firstObject.repoId');
      return this.set('model.activeBranches', Ember.merge(
        this.get('model.activeBranches'),
        this.get('store').query('branch', {
          repository_id: repoId,
          exists_on_github: true,
          offset: offset
        }))
      );
    }
  }
});
