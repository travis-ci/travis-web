export function initialize(appInstance) {
  const config = appInstance.resolveRegistration('config:environment');

  const { featureFlags } = config;

  if (featureFlags['enterprise-version']) {
    featureFlags['repository-filtering'] = true;
    featureFlags['debug-logging'] = false;
    featureFlags['landing-page-cta'] = false;
    featureFlags['show-running-jobs-in-sidebar'] = false;
    featureFlags['debug-builds'] = false;
    featureFlags['broadcasts'] = false;
  }
}

export default {
  name: 'enterprise-environment',
  after: 'pro-environment',
  initialize,
};
