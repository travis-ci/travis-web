/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Controller from '@ember/controller';
import config from 'travis/config/environment';

export default Controller.extend({
  config,
});
