/*jshint node:true*/
var EngineAddon = require('ember-engines/lib/engine-addon');
module.exports = EngineAddon.extend({
  name: 'about',
  lazyLoading: true,

  isDevelopingAddon: function() {
    return true;
  }
});
