/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

export default Component.extend({
  @service features: null,

  tagName: 'footer',
  classNames: ['footer']
});
