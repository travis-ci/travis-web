import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.HistoryLocation.extend({
  init: function() {
    this._super(...arguments);

    var auth = this.get('auth');
    if (auth) {
      // location's getURL is first called before we even
      // get to routes, so autoSignIn won't be called in
      // such case
      if (!auth.get('signedIn')) {
        return auth.autoSignIn();
      }
    }
  },

  getURL: function() {
    var url;
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
    }
    return url;
  },

  formatURL: function(logicalPath) {
    if (!config.enterprise && (logicalPath === '/repositories' || logicalPath === '/home' || logicalPath === '/home-pro')) {
      return '/';
    } else {
      return this._super(...arguments);
    }
  }
});
