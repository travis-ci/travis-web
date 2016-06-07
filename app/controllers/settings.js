import Ember from 'ember';

export default Ember.Controller.extend({
  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false),
  freeBranches: function() {
    var cronJobs = this.get('model.cronJobs.jobs');
    var branches = this.get('model.branches').filter(function(branch) {
      return branch.get('exists_on_github');
    });
    return branches.filter(function(branch) {
      return ! cronJobs.any(function(cron) {
        return branch.get('name') === cron.get('branch').get('name');
      });
    });
  }.property('model.cronJobs.jobs.@each'),

  freeSortedBranches: Ember.computed.sort('freeBranches', function(a, b) {
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
