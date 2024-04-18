import { later } from '@ember/runloop';
import config from 'travis/config/environment';
import SimpleLayoutRoute from 'travis/routes/simple-layout';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default SimpleLayoutRoute.extend({

  storage: service(),
  accounts: service(),
  features: service(),
  user: alias('accounts.user'),

  activate() {
    const controller = this.controllerFor('firstSync');
    controller.addObserver('isSyncing', this, 'isSyncingDidChange');
    this.isSyncingDidChange();
  },

  deactivate() {
    const controller = this.controllerFor('firstSync');
    return controller.removeObserver('controller.isSyncing', this, 'isSyncingDidChange');
  },

  getTransition() {

    if (!!this.get('features.enterpriseVersion')) return 'account';

    if (this.user.vcsType == 'AssemblaUser') return 'account';
    if (this.user.collaborator ||
        this.user.hasV2Subscription ||
        this.user.subscription ||
        this.user.accountSubscriptions.length > 0 ||
        this.user.accountv2Subscriptions.length > 0) return 'account';
    if (this.storage.wizardStep < 2 && !this.user.collaborator) return 'account_activation';
    if (this.storage.wizardStep >= 2 && this.storage.wizardStep <= 3) return 'account/repositories';
    return 'account';
  },

  isSyncingDidChange() {
    const controller = this.controllerFor('firstSync');
    if (!controller.isSyncing) {

      if (!!this.get('features.enterpriseVersion')) {
        this.transitionTo(this.getTransition());
        return;
      }
      this.accounts.fetchSubscriptions.perform()
        .then(() => this.accounts.fetchV2Subscriptions.perform())
        .then(() => {
          later(
            () => this.transitionTo(this.getTransition()),
            config.timing.syncingPageRedirectionTime
          );
        });
    }
  }

});
