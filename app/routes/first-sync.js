import { later } from '@ember/runloop';
import config from 'travis/config/environment';
import SimpleLayoutRoute from 'travis/routes/simple-layout';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default SimpleLayoutRoute.extend({

  storage: service(),
  accounts: service(),
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
    console.log("GET TR!!!");
    console.log(this.storage.wizardStep);
    console.log(this.accounts);
    console.log("---");
    console.log(this.user);
    console.log(this.user.hasV2Subscription);
    console.log(this.user.subscription);
    console.log(this.user.collaborator);
    if (this.user.vcsType == 'AssemblaUser') return 'account';
    console.log("FS1");
    if (this.user.collaborator ||
        this.user.hasV2Subscription ||
        this.user.subscription ||
        this.user.accountSubscriptions.length > 0 ||
        this.user.accountv2Subscriptions.length > 0) return 'account';
    console.log("FS2");
    if (this.storage.wizardStep < 2 && !this.user.collaborator) return 'account_activation';

    console.log("FS3");
    if (this.storage.wizardStep >= 2 && this.storage.wizardStep <= 3) return 'account/repositories';

    console.log("FS4");
    return 'account';
  },

  isSyncingDidChange() {
    const controller = this.controllerFor('firstSync');
    if (!controller.isSyncing) {
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
