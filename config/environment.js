/* eslint-env node */
module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'travis',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    defaultTitle: 'Travis CI',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding `Date.parse`.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    // defaults for running travis-web
    apiEndpoint: 'https://api.travis-ci.org',
    sourceEndpoint: 'https://github.com',
    pusher: {
      key: '5df8ac576dcccf4fd076',
      host: 'ws.pusherapp.com'
    },
    endpoints: {},
    intervals: { updateTimes: 1000 },
    githubOrgsOauthAccessSettingsUrl: 'https://github.com/settings/connections/applications/f244293c729d5066cf27',
    ajaxPolling: false,
    logLimit: 10000,
    emojiPrepend: ''
  };

  ENV.featureFlags = {
    'debug-logging': false,
    'pro-version': !!process.env.TRAVIS_PRO || false,
    'enterprise-version': !!process.env.TRAVIS_ENTERPRISE || false
  };

  var statusPageStatusUrl = 'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json';
  var sentryDSN = 'https://e775f26d043843bdb7ae391dc0f2487a@app.getsentry.com/75334';
  ENV.enterprise = ENV.featureFlags['enterprise-version'];

  if (typeof process !== 'undefined') {
    if (ENV.featureFlags['pro-version'] && !ENV.featureFlags['enterprise-version']) {
      // set defaults for pro if it's used
      // TODO: we have the same defaults also in ruby process,
      //       it would be nice to move it to one place. In theory
      //       we could just remove it from ruby process and rely
      //       on things set here, but I haven't tested that yet.
      ENV.apiEndpoint = 'https://api.travis-ci.com';
      ENV.pusher.key = '59236bc0716a551eab40';
      ENV.pusher.channelPrefix = 'private-';
      ENV.pagesEndpoint = 'https://billing.travis-ci.com';
      ENV.billingEndpoint = 'https://billing.travis-ci.com';
      ENV.statusPageStatusUrl = statusPageStatusUrl;
      ENV.sentry = {
        dsn: sentryDSN
      };
      ENV.endpoints = {
        sshKey: true,
        caches: true
      };
      ENV.userlike = true;
      ENV.beacon = true;
      ENV.urls = {
        legal: ENV.billingEndpoint + '/pages/legal',
        imprint: ENV.billingEndpoint + '/pages/imprint',
        security: ENV.billingEndpoint + '/pages/security',
        terms: ENV.billingEndpoint + '/pages/terms'
      };
    }

    if (process.env.API_ENDPOINT) {
      ENV.apiEndpoint = process.env.API_ENDPOINT;
    }

    if (process.env.AUTH_ENDPOINT) {
      ENV.authEndpoint = process.env.AUTH_ENDPOINT;
    }
  }

  if (environment === 'development') {
    ENV['ember-cli-mirage'] = {
      enabled: false
    };

    ENV.sentry = {
      development: true
    };

    ENV.statusPageStatusUrl = statusPageStatusUrl;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    ENV.APP.rootElement = '#ember-testing';

    ENV.apiEndpoint = '';
    ENV.statusPageStatusUrl =  null;

    ENV.sentry = {
      development: true
    };

    ENV.endpoints = {
      sshKey: true,
      caches: true
    };

    ENV.pusher = {};

    ENV.skipConfirmations = true;

    ENV.logLimit = 100;

    ENV.percy = {
      breakpointsConfig: {
        mobile: 375,
        tablet: 768,
        desktop: 1280
      },
      defaultBreakpoints: ['desktop']
    };

    ENV.featureFlags = {
      'debug-logging': false,
      'dashboard': false
    };
  }

  if (environment === 'production') {
    ENV.release = process.env.SOURCE_VERSION || '-';
    if (process.env.DISABLE_SENTRY) {
      ENV.sentry = {
        development: true
      };
    } else {
      ENV.sentry = {
        dsn: sentryDSN
      };
    }

    ENV.statusPageStatusUrl = statusPageStatusUrl;
  }

  if (process.env.DEPLOY_TARGET) {
    var s3Bucket = require('./deploy')(process.env.DEPLOY_TARGET).s3.bucket;
    ENV.emojiPrepend = '//' + s3Bucket + '.s3.amazonaws.com';
  }

  // We want CSP settings to be available during development (via ember addon)
  // and in production (by returning the actual header with a Ruby server)
  // The problem is that we host travis-web on multiple hosts. Because of that
  // if we add an api host to CSP rules here, we won't be able to set it up
  // properly in a Ruby server (because this file will be compiled on deploy,
  // where host info is not available).
  // That's why I create a contentSecurityPolicyRaw hash first and then I add
  // API host to any sections listed in cspSectionsWithApiHost. That way I can
  // do it in the same way on the Ruby server.
  ENV.contentSecurityPolicyRaw = {
    'default-src': "'none'",
    'script-src': "'self' https://ssl.google-analytics.com https://djtflbt20bdde.cloudfront.net/ https://js.pusher.com",
    'font-src': "'self' https://fonts.googleapis.com/css https://fonts.gstatic.com",
    'connect-src': "'self' ws://ws.pusherapp.com wss://ws.pusherapp.com https://*.pusher.com https://s3.amazonaws.com/archive.travis-ci.com/ https://s3.amazonaws.com/archive.travis-ci.org/ app.getsentry.com https://pnpcptp8xh9k.statuspage.io/ https://ssl.google-analytics.com",
    'img-src': "'self' data: https://www.gravatar.com http://www.gravatar.com app.getsentry.com https://*.githubusercontent.com https://0.gravatar.com https://ssl.google-analytics.com",
    'style-src': "'self' https://fonts.googleapis.com 'unsafe-inline' https://djtflbt20bdde.cloudfront.net",
    'media-src': "'self'",
    'frame-src': "'self' https://djtflbt20bdde.cloudfront.net",
    'report-uri': 'https://65f53bfdfd3d7855b8bb3bf31c0d1b7c.report-uri.io/r/default/csp/reportOnly',
    'block-all-mixed-content': '',
    'form-action': "'self'", // probably doesn't matter, but let's have it anyways
    'frame-ancestors': "'none'",
    'object-src': 'https://djtflbt20bdde.cloudfront.net'
  };
  ENV.cspSectionsWithApiHost = ['connect-src', 'img-src'];
  ENV.contentSecurityPolicy = JSON.parse(JSON.stringify(ENV.contentSecurityPolicyRaw));
  ENV.contentSecurityPolicyMeta = false;

  ENV.cspSectionsWithApiHost.forEach((section) => {
    ENV.contentSecurityPolicy[section] += " " + ENV.apiEndpoint;
  });

  return ENV;
};
