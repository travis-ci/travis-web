/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias, sort, filterBy } from '@ember/object/computed';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  externalLinks: service(),
  features: service(),

  envVars: computed('unsortedEnvVars', function () {
    let envVars = this.get('unsortedEnvVars');
    return envVars.sortBy('name');
  }),

  config,
  unsortedEnvVars: filterBy('model.envVars', 'isNew', false),
  cronJobs: alias('model.cronJobs.jobs.[]'),

  branchesWithoutCron: computed('cronJobs', 'model.branches.@each.exists_on_github', function () {
    let cronJobs = this.get('cronJobs');
    let branches = this.get('model.branches');
    return branches
      .filter(branch => branch.get('exists_on_github'))
      .filter(branch => {
        const branchName = branch.get('name');
        return ! cronJobs.any(cron => branchName === cron.get('branch.name'));
      });
  }),

  sortedBranchesWithoutCron: sort('branchesWithoutCron', (a, b) => {
    if (a.get('defaultBranch')) {
      return -1;
    } else if (b.get('defaultBranch')) {
      return 1;
    } else {
      return a.get('name') > b.get('name');
    }
  }),

  showAutoCancellationSwitches: computed('model.settings', function () {
    let settings = this.get('model.settings');
    return settings.hasOwnProperty('auto_cancel_pushes')
      || settings.hasOwnProperty('auto_cancel_pull_requests');
  }),

  migratedRepositorySettingsLink: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return this.get('externalLinks').migratedToComSettingsLink(slug);
  }),

  displaySettingsDisabledAfterMigrationModal: computed(
    'features.{proVersion,enterpriseVersion}',
    'repo.migrationStatus',
    function () {
      let pro = this.get('features.proVersion');
      let enterprise = this.get('features.enterpriseVersion');
      let migrationStatus = this.get('repo.migrationStatus');
      return !pro && !enterprise && ['migrating', 'migrated'].includes(migrationStatus);
    }
  ),

  actions: {
    sshKeyAdded(sshKey) {
      return this.set('model.customSshKey', sshKey);
    },

    sshKeyDeleted() {
      return this.set('model.customSshKey', null);
    }
  }
});
