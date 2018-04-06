export function initialize(appInstance) {
  const config = appInstance.resolveRegistration('config:environment');

  const { featureFlags } = config;

  if (featureFlags['pro-version']) {
    featureFlags['repository-filtering'] = true;
    featureFlags['debug-logging'] = false;
    featureFlags['landing-page-cta'] = false;
    featureFlags['show-running-jobs-in-sidebar'] = true;
    featureFlags['debug-builds'] = true;
    featureFlags['broadcasts'] = true;
    featureFlags['beta-features'] = true;
  }
}

export default {
  name: 'pro-environment',
  initialize
};
