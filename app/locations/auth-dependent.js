import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.HistoryLocation.extend({
  init() {
    this._super(...arguments);

    const auth = this.get('auth');
    if (auth) {
      // location's getURL is first called before we even
      // get to routes, so autoSignIn won't be called in
      // such case
      if (!auth.get('signedIn')) {
        return auth.autoSignIn();
      }
    }
  },

  auth: Ember.computed(function () {
    return Ember.getOwner(this).lookup('service:auth');
  }),

  getURL() {
    let url;
    url = this._super(...arguments);
    if (location.pathname === '/' && !config.enterprise) {
      if (this.get('auth.signedIn')) {
        return '/repositories';
      } else {
        if (config.pro) {
          return '/home-pro';
        } else {
          return '/home';
        }
      }
    } else if (location.pathname === '/' && config.enterprise) {
      if (this.get('auth.signedIn')) {
        return '/repositories';
      } else {
        return '/auth';
      }
    }
    return url;
  },

  formatURL(logicalPath) {
    let rootRedirects = ['/repositories', '/home', 'home-pro'];
    if (!config.enterprise && rootRedirects.contains(logicalPath)) {
      return '/';
    } else {
      return this._super(...arguments);
    }
  }
});
