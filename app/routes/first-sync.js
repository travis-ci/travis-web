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
    if(this.user.hasV2Subscription || this.user.subscription) return 'account';
    if(this.storage.wizardStep < 2 && !this.user.colaborator) return 'account_activation';
    if(this.storage.wizardStep >=2 && this.storage.wizardStep <=3) return 'account/repositories';
    return 'account';
  },

  isSyncingDidChange() {
    const controller = this.controllerFor('firstSync');
    if (!controller.isSyncing) {
      later(
        () => this.transitionTo(this.getTransition()),
        config.timing.syncingPageRedirectionTime
      );
    }
  }

});
