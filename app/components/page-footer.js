/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Component.extend({
  router: service(),
  features: service(),

  config,

  tagName: 'footer',
  classNames: ['footer']
});
