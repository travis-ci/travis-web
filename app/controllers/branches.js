import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed('model.activeBranches', function () {
    return this.get('model.activeBranches').filterBy('defaultBranch')[0];
  }),

  nonDefaultBranches: Ember.computed.filter('model.activeBranches', function (branch) {
    return !branch.get('defaultBranch');
  }),

  deletedBranches: {},

  actions: {
    fetchInactive() {
      this.get('store').query('branch', {
        repository_id: this.get('defaultBranch.repoId'),
        exists_on_github: false
      }).then(function (response) {
        // debugger
        this.set('deletedBranches', response.content);
      });
    }
  }
});
