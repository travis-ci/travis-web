/* global HS */

import Component from '@ember/component';
import { action } from 'ember-decorators/object';
import config from 'travis/config/environment';

export default Component.extend({
  tagName: '',

  config,

  @action
  helpscoutTrigger() {
    HS.beacon.open();
    return false;
  },
});
