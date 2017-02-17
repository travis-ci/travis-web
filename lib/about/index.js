/* eslint-env node */

const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
  name: 'about',
  lazyLoading: false,

  isDevelopingAddon() {
    return true;
  }
});
