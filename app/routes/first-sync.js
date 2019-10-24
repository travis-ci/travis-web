import { later } from '@ember/runloop';
import config from 'travis/config/environment';
import SimpleLayoutRoute from 'travis/routes/simple-layout';
import { inject as service } from '@ember/service';

export default SimpleLayoutRoute.extend({
  auth: service(),

  beforeModel(transition) {
    const { currentUser: user } = this.auth;
    const isFirstSync = !!user && user.isSyncing && !user.syncedAt;
    if (!isFirstSync) {
      transition.abort();
      return this.transitionTo('dashboard');
    }
  },

  activate() {
    const controller = this.controllerFor('firstSync');
    controller.addObserver('isSyncing', this, 'isSyncingDidChange');
    this.isSyncingDidChange();
  },

  deactivate() {
    const controller = this.controllerFor('firstSync');
    return controller.removeObserver('controller.isSyncing', this, 'isSyncingDidChange');
  },

  isSyncingDidChange() {
    const controller = this.controllerFor('firstSync');
    if (!controller.isSyncing) {
      later(
        () => this.transitionTo('account'),
        config.timing.syncingPageRedirectionTime
      );
    }
  }

});
