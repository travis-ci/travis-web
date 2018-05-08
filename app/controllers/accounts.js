/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default Controller.extend({
  @service features: null,
  config,
});
