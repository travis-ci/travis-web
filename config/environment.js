/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'travis',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV.endpoints = {
    ssh_key: false,
    caches: false
  };
  ENV.pro = false;
  ENV.pusher = {};
  ENV.intervals = { updateTimes: 1000, times: -1 };
  ENV.api_endpoint = 'https://api.travis-ci.org';

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    // TODO: for some reason unsafe-eval is needed when I use collection helper,
    //       we should probably remove it at some point
    'script-src': "'self' 'unsafe-eval'",
    'font-src': "'self'",
    'connect-src': "'self' https://api.travis-ci.org",
    'img-src': "'self' data: https://www.gravatar.com http://www.gravatar.com",
    'style-src': "'self'",
    'media-src': "'self'",
    'frame-src': "'self' https://api.travis-ci.org"
  }

  return ENV;
};
