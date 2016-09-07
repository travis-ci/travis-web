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
    enterprise: !!process.env.TRAVIS_ENTERPRISE || false,
    endpoints: {},
    intervals: { updateTimes: 1000 },
    githubOrgsOauthAccessSettingsUrl: 'https://github.com/settings/connections/applications/f244293c729d5066cf27',
    ajaxPolling: false,

    heap: {
      projectId: '1049054202'
    },
    logLimit: 10000
  };

  ENV.featureFlags = {
    'debug-logging': false,
    'pro-version': !!process.env.TRAVIS_PRO || false
  };

  var statusPageStatusUrl = 'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json';
  var sentryDSN = 'https://e775f26d043843bdb7ae391dc0f2487a@app.getsentry.com/75334';

  // Do not collect metrics if in non-production env or enterprise
  if (process.env.TRAVIS_ENTERPRISE || environment !== 'production') {
    ENV.heap = {
      development: true
    };
  }

  if (typeof process !== 'undefined') {
    if (ENV.featureFlags['pro-version'] && !process.env.TRAVIS_ENTERPRISE) {
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
        legal: ENV.billingEndpoint + "/pages/legal",
        imprint: ENV.billingEndpoint + "/pages/imprint",
        security: ENV.billingEndpoint + "/pages/security",
        terms: ENV.billingEndpoint + "/pages/terms"
      };
      ENV.heap = {
        projectId: '1556722898'
      }
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
    ENV.baseURL = '/';
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

    ENV.skipConfirmations = true;

    ENV.logLimit = 100;
  }

  if (environment === 'production') {
    ENV.release = process.env.SOURCE_VERSION || '-';
    ENV['ember-cli-mirage'] = {
      enabled: false
    };

    ENV.sentry = {
      dsn: sentryDSN
    };

    ENV.statusPageStatusUrl = statusPageStatusUrl;
  }

  // TODO: I insert values from ENV here, but in production
  // this file is compiled and is not executed on runtime.
  // We don't use CSP at the moment outside of development (ie. we don't
  // set CSP headers), but it would be nice to do it and then we need to
  // think about a better way to override it
  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'script-src': "'self'",
    'font-src': "'self' https://fonts.googleapis.com/css https://fonts.gstatic.com",
    'connect-src': "'self' " + ENV.apiEndpoint + " ws://ws.pusherapp.com wss://ws.pusherapp.com http://sockjs.pusher.com https://s3.amazonaws.com/archive.travis-ci.com/ https://s3.amazonaws.com/archive.travis-ci.org/ app.getsentry.com",
    'img-src': "'self' data: https://www.gravatar.com http://www.gravatar.com app.getsentry.com",
    'style-src': "'self' https://fonts.googleapis.com",
    'media-src': "'self'",
    'frame-src': "'self' " + ENV.apiEndpoint
  };

  return ENV;
};
