/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias, filterBy, reads, none, not } from '@ember/object/computed';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  externalLinks: service(),
  features: service(),

  envVars: computed('unsortedEnvVars', function () {
    let envVars = this.unsortedEnvVars;
    return envVars.sortBy('name');
  }),

  config,

  unsortedEnvVars: filterBy('model.envVars', 'isNew', false),
  cronJobs: alias('model.cronJobs.jobs.[]'),

  showAutoCancellationSwitches: computed('model.settings', function () {
    let settings = this.get('model.settings');
    return settings.hasOwnProperty('auto_cancel_pushes')
      || settings.hasOwnProperty('auto_cancel_pull_requests');
  }),

  showAllowConfigImportsSwitch: computed('model.settings', 'repo.private', function () {
    let settings = this.get('model.settings');
    let isPrivate = this.get('repo.private');
    return isPrivate && settings.hasOwnProperty('allow_config_imports');
  }),

  showBetaFeatures: reads('showConfigValidationSwitches'),
  hasNoConfigValidation: none('model.settings.config_validation'),
  showConfigValidationSwitches: not('hasNoConfigValidation'),

  migratedRepositorySettingsLink: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return this.externalLinks.migratedToComSettingsLink(slug);
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
