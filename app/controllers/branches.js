import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed('model.activeBranches', function () {
    return this.get('model.activeBranches').filterBy('defaultBranch')[0];
  }),

  nonDefaultBranches: Ember.computed.filter('model.activeBranches', function (branch) {
    return !branch.get('defaultBranch');
  }).property('model.activeBranches'),

  actions: {
    fetchInactive() {
      return this.set('model.deletedBranches', this.get('store').query('branch', {
        repository_id: this.get('defaultBranch.repoId'),
        exists_on_github: false
      }));
    },
    fetchActive(offset) {
      return this.set('model.activeBranches', Ember.merge(
        this.get('model.activeBranches'),
        this.get('store').query('branch', {
          repository_id: this.get('defaultBranch.repoId'),
          exists_on_github: false,
          offset: offset
        }))
      );
    }
  }
});
