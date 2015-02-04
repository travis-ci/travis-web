/* jshint node: true */

// TODO: how to include this from app/utils/ here?
var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj)
      continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object')
          deepExtend(out[key], obj[key]);
        else
          out[key] = obj[key];
      }
    }
  }

  return out;
};

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
    },

    // defaults for running travis-web
    api_endpoint: 'https://api.travis-ci.org',
    source_endpoint: 'https://github.com',
    pusher: {
      key: '5df8ac576dcccf4fd076',
      host: 'ws.pusherapp.com'
    },
    pro: false,
    enterprise: false,
    endpoints: {},
    intervals: { updateTimes: 1000 }
  };

  // merge environment vars from index.html
  if(typeof TravisENV !== 'undefined') {
    extend(ENV, TravisENV);
  }

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

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    // TODO: for some reason unsafe-eval is needed when I use collection helper,
    //       we should probably remove it at some point
    'script-src': "'self' 'unsafe-eval'",
    'font-src': "'self'",
    'connect-src': "'self' https://api.travis-ci.org ws://ws.pusherapp.com wss://ws.pusherapp.com http://sockjs.pusher.com",
    'img-src': "'self' data: https://www.gravatar.com http://www.gravatar.com",
    'style-src': "'self'",
    'media-src': "'self'",
    'frame-src': "'self' https://api.travis-ci.org"
  }

  return ENV;
};
