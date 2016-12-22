var tryConfigurations = require('./ember-try');

var EMBER_VERSION = process.env.EMBER_VERSION;

module.exports = {
  scenarios: tryConfigurations.scenarios.filter(function(scenario) {
    return scenario.name.indexOf(EMBER_VERSION) > -1;
  }),
  bowerOptions: tryConfigurations.bowerOptions
}
