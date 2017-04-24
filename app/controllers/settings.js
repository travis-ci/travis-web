import Ember from 'ember';
import computed, { alias, sort, filterBy } from 'ember-computed-decorators';

export default Ember.Controller.extend({
  envVarSorting: ['name'],
  envVars: Ember.computed.sort('unsortedEnvVars', 'envVarSorting'),

  @filterBy('model.envVars', 'isNew', false)
  unsortedEnvVars: null,

  @alias('model.cronJobs.jobs.[]')
  cronJobs: null,

  @computed('cronJobs', 'model.branches')
  branchesWithoutCron(cronJobs, branches) {
    return branches
             .filter(branch => branch.get('existsOnGithub'))
             .filter(branch => {
               return ! cronJobs.any(cron => branch.get('name') === cron.get('branch.name'));
             });
  },

  @sort('branchesWithoutCron', (a, b) => {
    if (a.get('defaultBranch')) {
      return -1;
    } else if (b.get('defaultBranch')) {
      return 1;
    } else {
      return a.get('name') > b.get('name');
    }
  })
  sortedBranchesWithoutCron: null,

  @computed('model.settings')
  showAutoCancellationSwitches(settings) {
    return settings.hasOwnProperty('auto_cancel_pushes')
           || settings.hasOwnProperty('auto_cancel_pull_requests');
  },

  actions: {
    sshKeyAdded(sshKey) {
      return this.set('model.customSshKey', sshKey);
    },

    sshKeyDeleted() {
      return this.set('model.customSshKey', null);
    }
  }
});
