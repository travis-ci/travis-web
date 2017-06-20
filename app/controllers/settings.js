import Ember from 'ember';
import computed, { alias, sort, filterBy } from 'ember-computed-decorators';

export default Ember.Controller.extend({
  envVarSorting: ['name'],
  envVars: Ember.computed.sort('unsortedEnvVars', 'envVarSorting'),

  @filterBy('model.envVars', 'isNew', false)
  unsortedEnvVars: null,

  @alias('model.cronJobs.jobs.[]')
  cronJobs: null,

  // TODO: the last dependency is needed here, because otherwise refreshing this
  // property will fail in tests (because for some reason newly added branch is
  // in root.loading state). We should look into it at some point
  @computed('cronJobs', 'model.branches.[]', 'model.branches.@each.exists_on_github')
  branchesWithoutCron(cronJobs, branches, _) {
    return branches
             .filter(branch => branch.get('exists_on_github'))
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
