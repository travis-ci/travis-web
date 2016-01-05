import SimpleLayoutRoute from 'travis/routes/simple-layout';
import Ember from 'ember';

export default SimpleLayoutRoute.extend({
  activate() {
    var controller;
    controller = this.controllerFor('firstSync');
    return controller.addObserver('isSyncing', this, this.isSyncingDidChange);
  },

  deactivate() {
    var controller;
    controller = this.controllerFor('firstSync');
    return controller.removeObserver('controller.isSyncing', this, this.isSyncingDidChange);
  },

  isSyncingDidChange() {
    var controller, self;
    controller = this.controllerFor('firstSync');
    if (!controller.get('isSyncing')) {
      self = this;
      return Ember.run.later(this, function() {
        return this.store.query('repo', {
          member: this.get('controller.user.login')
        }).then(function(repos) {
          if (repos.get('length')) {
            return self.transitionTo('main');
          } else {
            return self.transitionTo('profile');
          }
        }).then(null, function(e) {
          return console.log('There was a problem while redirecting from first sync', e);
        });
      }, this.get('config').syncingPageRedirectionTime);
    }
  },

  actions: {
    redirectToGettingStarted: function() {
      // do nothing, we are showing first sync, so it's normal that there is
      // no owned repos
    }
  }
});
