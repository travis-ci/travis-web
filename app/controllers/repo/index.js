import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { reads, and, or, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  auth: service(),
  accounts: service(),

  repo: null,

  repoOwner: computed('accounts.all.@each.login', 'repo.owner.login', 'auth.signedIn', function () {
    return this.auth.signedIn && this.accounts.all.findBy('login', this.repo.owner.login);
  }),

  permissions: reads('repo.permissions'),

  isMigrationEnabled: reads('repoOwner.allowMigration'),
  isMigrationNotEnabled: not('isMigrationEnabled'),

  isMigrationBetaRequested: reads('repoOwner.isMigrationBetaRequested'),
  isMigrationBetaNotRequested: not('isMigrationBetaRequested'),

  hasPermissions: reads('permissions.admin'),
  isInsufficientPermissions: not('hasPermissions'),

  isMigrationAllowed: reads('repo.isMigratable'),
  isMigrationNotAllowed: not('isMigrationAllowed'),

  showSignInButton: not('auth.signedIn'),
  showMigrateButton: and('auth.signedIn', 'isMigrationEnabled'),
  showBetaButton: and('auth.signedIn', 'isMigrationNotEnabled', 'isMigrationBetaNotRequested'),

  isButtonDisabled: or('repo.isMigrationInProgress', 'isMigrationNotAllowed', 'isInsufficientPermissions'),

  headerText: computed('isMigrationEnabled', 'isMigrationBetaRequested', function () {
    const { isMigrationEnabled, isMigrationBetaRequested } = this;
    if (isMigrationEnabled)
      return 'You can now start building this repository, right here at travis-ci.com!';
    if (isMigrationBetaRequested)
      return 'You can start building this repository at travis-ci.com once your Beta request is accepted';
    else
      return 'You can now have all your public and private repositories together at travis-ci.com';
  }),

  helperText: computed('isMigrationBetaRequested', 'hasPermissions', 'isMigrationEnabled', 'auth.signedIn', function () {
    const { isMigrationEnabled, isMigrationBetaRequested, hasPermissions, auth } = this;
    if (isMigrationBetaRequested)
      return 'This repository cannot be migrated at this time. Please wait until your account is accepted into the beta. Thank you.';
    else if (isMigrationEnabled && !hasPermissions)
      return 'Only repository owners can migrate this repository from travis-ci.org';
    else if (!isMigrationEnabled && !hasPermissions && auth.signedIn)
      return 'Only repository owners can sign up for beta';
  }),

  actions: {

    migrate() {
      this.repo.set('migrationStatus', 'queued');
      this.repo.startMigration();
    }

  }

});
