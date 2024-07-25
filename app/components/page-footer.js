/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Component.extend({
  router: service(),
  auth: service(),
  features: service(),

  config,

  tagName: 'footer',
  classNames: ['footer'],

  aidaEnabled: !config.disableAida,

  currentYear() {
    return new Date().getFullYear();
  }
});
