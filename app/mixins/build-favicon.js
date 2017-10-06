import Mixin from '@ember/object/mixin';
import colorForState from 'travis/utils/color-for-state';
import FaviconManager from 'travis/utils/favicon-manager';
import getFaviconUri from 'travis/utils/favicon-data-uris';

export default Mixin.create({
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
    let color = colorForState(state);
    return this.setFavicon(getFaviconUri(color));
  },

  setDefault() {
    return this.setFavicon(getFaviconUri('default'));
  },

  setFavicon(href) {
    return this.faviconManager.setFavicon(href);
  }
});
