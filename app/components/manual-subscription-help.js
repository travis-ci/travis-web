/* global HS */

import Component from '@ember/component';
import config from 'travis/config/environment';

export default Component.extend({
  tagName: '',

  config,

  actions: {
    helpscoutTrigger() {
      HS.beacon.open();
      return false;
    },
  },
});
