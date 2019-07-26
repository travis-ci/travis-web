import { later } from '@ember/runloop';
import config from 'travis/config/environment';
import SimpleLayoutRoute from 'travis/routes/simple-layout';

export default SimpleLayoutRoute.extend({
  activate() {
    let controller;
    controller = this.controllerFor('firstSync');
    controller.addObserver('isSyncing', this, 'isSyncingDidChange');
    this.isSyncingDidChange();
  },

  deactivate() {
    let controller;
    controller = this.controllerFor('firstSync');

    return controller.removeObserver('controller.isSyncing', this, 'isSyncingDidChange');
  },

  isSyncingDidChange() {
    let controller = this.controllerFor('firstSync');
    if (!controller.isSyncing) {
      return later(this, function () {
        return this.transitionTo('account');
      }, config.timing.syncingPageRedirectionTime);
    }
  },

  actions: {
    redirectToGettingStarted: function () {
      // do nothing, we are showing first sync, so it's normal that there is
      // no owned repos
    }
  }
});
