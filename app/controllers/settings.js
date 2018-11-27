/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';
import { alias, sort, filterBy } from 'ember-decorators/object/computed';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default Controller.extend({
  @service externalLinks: null,

  @computed('unsortedEnvVars')
  envVars(envVars) {
    return envVars.sortBy('name');
  },

  config,

  @filterBy('model.envVars', 'isNew', false)
  unsortedEnvVars: null,

  @alias('model.cronJobs.jobs.[]')
  cronJobs: null,

  @computed('cronJobs', 'model.branches.@each.exists_on_github')
  branchesWithoutCron(cronJobs, branches) {
    return branches
      .filter(branch => branch.get('exists_on_github'))
      .filter(branch => {
        const branchName = branch.get('name');
        return ! cronJobs.any(cron => branchName === cron.get('branch.name'));
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

  @computed('repo.slug')
  migratedRepositorySettingsLink(slug) {
    return this.get('externalLinks').migratedToComSettingsLink(slug);
  },

  @computed('features.{proVersion,enterpriseVersion}', 'repo.migrationStatus')
  displaySettingsDisabledAfterMigrationModal(pro, enterprise, migrationStatus) {
    return !pro && !enterprise && ['migrating', 'migrated'].includes(migrationStatus);
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
