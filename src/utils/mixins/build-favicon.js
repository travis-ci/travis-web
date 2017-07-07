import Ember from 'ember';
import colorForState from "travis/src/utils/color-for-state";
import FaviconManager from "travis/src/utils/favicon-manager/util";
import getFaviconUri from "travis/src/utils/favicon-data-uris";

export default Ember.Mixin.create({
  actions: {
    faviconStateDidChange(state) {
      if (state) {
        return this.setFaviconForState(state);
      } else {
        return this.setDefault();
      }
    }
  },

  init() {
    this.faviconManager = new FaviconManager();
    return this._super(...arguments);
  },

  setFaviconForState(state) {
    var color;
    color = colorForState(state);
    return this.setFavicon(getFaviconUri(color));
  },

  setDefault() {
    return this.setFavicon(getFaviconUri('default'));
  },

  setFavicon(href) {
    return this.faviconManager.setFavicon(href);
  }
});
