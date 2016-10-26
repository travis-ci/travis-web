import Ember from 'ember';

export default Ember.Controller.extend({
  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false),

  branchesWithoutCron: Ember.computed('model.cronJobs.jobs.@each', function () {
    var cronJobs = this.get('model.cronJobs.jobs');
    var branches = this.get('model.branches').filter(function (branch) {
      return branch.get('exists_on_github');
    });
    return branches.filter(function (branch) {
      return ! cronJobs.any(cron => branch.get('name') === cron.get('branch.name'));
    });
  }),

  sortedBranchesWithoutCron: Ember.computed.sort('branchesWithoutCron', function (a, b) {
    if (a.get('defaultBranch')) {
      return -1;
    } else if (b.get('defaultBranch')) {
      return 1;
    } else {
      return a.get('name') > b.get('name');
    }
  }),

  showAutoCancellationSwitches: Ember.computed(
    'model.settings.auto_cancel_pushes',
    'model.settings.auto_cancel_pull_requests', function () {
      const settings = this.get('model.settings');

      return settings.hasOwnProperty('auto_cancel_pull_requests') ||
        settings.hasOwnProperty('auto_cancel_pushes');
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
