import { later } from '@ember/runloop';
import config from 'travis/config/environment';
import SimpleLayoutRoute from 'travis/routes/simple-layout';

export default SimpleLayoutRoute.extend({

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
