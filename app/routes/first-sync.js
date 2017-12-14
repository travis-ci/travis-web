import { later } from '@ember/runloop';
import SimpleLayoutRoute from 'travis/routes/simple-layout';

export default SimpleLayoutRoute.extend({
  activate() {
    let controller;
    controller = this.controllerFor('firstSync');
    return controller.addObserver('isSyncing', this, this.isSyncingDidChange);
  },

  deactivate() {
    let controller;
    controller = this.controllerFor('firstSync');
    return controller.removeObserver('controller.isSyncing', this, this.isSyncingDidChange);
  },

  isSyncingDidChange() {
    let controller, self;
    controller = this.controllerFor('firstSync');
    if (!controller.get('isSyncing')) {
      return later(this, function () {
        return this.store.query('repo', {
          member: this.get('controller.user.login')
        }).then((repos) => {
          if (repos.get('length')) {
            return this.transitionTo('index');
          } else {
            return this.transitionTo('profile');
          }
        }).then((e) => {
          if (self.get('features.debugLogging')) {
            // eslint-disable-next-line
            return console.log('There was a problem while redirecting from first sync', e);
          }
        });
      }, this.get('config').syncingPageRedirectionTime);
    }
  },

  actions: {
    redirectToGettingStarted: function () {
      // do nothing, we are showing first sync, so it's normal that there is
      // no owned repos
    }
  }
});
