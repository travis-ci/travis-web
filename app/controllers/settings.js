import Ember from 'ember';

export default Ember.Controller.extend({
  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false),
  cronJobs: Ember.computed.sort('model.cronJobs', function(a, b) {
    if(a.get('branch.defaultBranch')) {
      return -1;
    } else if(b.get('branch.defaultBranch')) {
      return 1;
    } else {
      return a.get('branch.name') > b.get('branch.name');
    }
  }),
  branches: Ember.computed.sort('model.branches', function(a, b) {
    if(a.get('defaultBranch')) {
      return -1;
    } else if(b.get('defaultBranch')) {
      return 1;
    } else {
      return a.get('name') > b.get('name');
    }
  }),
  actions: {
    sshKeyAdded(sshKey) {
      return this.set('model.customSshKey', sshKey);
    },

    sshKeyDeleted() {
      return this.set('model.customSshKey', null);
    }
  }
});
