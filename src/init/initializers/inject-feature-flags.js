import config from 'travis/config/environment';

export function initialize(app) {
  let serviceName = config.featureFlagsService || 'features';
  let serviceLookupName = `service:${serviceName}`;
  app.inject('adapter', serviceName, serviceLookupName);
  app.inject('model', serviceName, serviceLookupName);
  if (config.environment === 'development') {
    // eslint-disable-next-line
    console.log('EMBER FEATURE FLAGS were auto-injected into all: routes, controllers, components, adapters and models');
  }
}

export default {
  name: 'inject-feature-flags',
  initialize
};
