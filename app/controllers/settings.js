import Ember from 'ember';

export default Ember.Controller.extend({
  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false),

  branchesWithoutCron: Ember.computed('model.cronJobs.jobs.@each', function () {
    const cronJobs = this.get('model.cronJobs.jobs');
    const branches = this.get('model.branches').filter(branch => {
      branch.get('exists_on_github');
    });
    return branches.filter(branch => {
      !cronJobs.any(cron => {
        branch.get('name') === cron.get('branch.name');
      });
    });
  }),

  sortedBranchesWithoutCron: Ember.computed.sort('branchesWithoutCron', (a, b) => {
    if (a.get('defaultBranch')) {
      return -1;
    } else if (b.get('defaultBranch')) {
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
