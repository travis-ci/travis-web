/* eslint-env node */
'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'travis',
    environment,
    rootURL: '/',
    locationType: 'auto',
    defaultTitle: 'Travis CI',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
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
      host: 'ws.pusherapp.com',
      debug: false
    },
    intercom: {
      appId: 'placeholder',
      enabled: false
    },
    urls: {
      about: 'https://about.travis-ci.com',
      blog: 'https://blog.travis-ci.com',
      changelog: 'https://changelog.travis-ci.com',
      community: 'https://travis-ci.community',
      dashboard: 'https://travis-ci.com/dashboard',
      docs: 'https://docs.travis-ci.com',
      gettingStarted: 'https://docs.travis-ci.com/user/getting-started/#to-get-started-with-travis-ci',
      enterprise: 'https://enterprise.travis-ci.com',
      imprint: 'https://docs.travis-ci.com/imprint.html',
      jobs: 'https://travisci.workable.com/',
      plans: 'https://travis-ci.com/plans',
      privacy: 'https://docs.travis-ci.com/legal/privacy-policy',
      security: 'https://docs.travis-ci.com/legal/security',
      status: 'https://www.traviscistatus.com/',
      support: 'mailto:support@travis-ci.com',
      terms: 'https://docs.travis-ci.com/legal/terms-of-service/',
      twitter: 'https://twitter.com/travisci',
    },
    endpoints: {},
    githubApps: false,
    timing: {
      syncingPageRedirectionTime: 5000,
    },
    intervals: {
      updateTimes: 1000,
      branchCreatedSyncDelay: 2000,
      repositorySearchDebounceRate: 500,
      triggerBuildRequestDelay: 3000,
      fetchRecordsForPusherUpdatesThrottle: 1000,
      repositoryFilteringDebounceRate: 200,
      syncingPolling: 3000,
      githubAppsInstallationPolling: 4000,
    },
    githubOrgsOauthAccessSettingsUrl: 'https://github.com/settings/connections/applications/f244293c729d5066cf27',
    apiTraceEndpoint: 'https://papertrailapp.com/systems/travis-org-api-production/events?q=program%3Aapp%2Fweb%20log-tracing%20',
    ajaxPolling: false,
    logLimit: 10000,
    emojiPrepend: '',
    statusPageStatusUrl: 'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json',

    zendesk: {
      apiHost: 'https://travisci.zendesk.com',
      createRequestEndpoint: '/api/v2/requests.json'
    },

    moment: {
      includeTimezone: 'subset'
    },

    liquidFire: {
      enabled: true
    }
  };

  ENV.featureFlags = {
    'repository-filtering': true,
    'debug-logging': false,
    'landing-page-cta': true,
    'show-running-jobs-in-sidebar': false,
    'debug-builds': false,
    'broadcasts': true,
    'beta-features': true,
    'github-apps': false,
  };

  const { TRAVIS_PRO, TRAVIS_ENTERPRISE } = process.env;

  if (TRAVIS_PRO) {
    ENV.featureFlags['pro-version'] = true;
    ENV.featureFlags['github-apps'] = true;
    ENV.pro = true;
  }

  if (TRAVIS_ENTERPRISE) {
    ENV.featureFlags['enterprise-version'] = true;
    ENV.enterprise = true;
  }

  ENV.pagination = {
    dashboardReposPerPage: 25,
    profileReposPerPage: 25,
  };

  ENV.sentry = {
    dsn: 'https://e775f26d043843bdb7ae391dc0f2487a@app.getsentry.com/75334',
    whitelistUrls: [
      /https:\/\/cdn\.travis-ci\.(org|com)\/assets\/(vendor|travis)-.+.js/
    ]
  };

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
      ENV.marketplaceEndpoint = 'https://github.com/marketplace/travis-ci/';
      ENV.endpoints = {
        sshKey: true,
        caches: true
      };
      ENV.userlike = true;

      if (process.env.GITHUB_APPS_APP_NAME) {
        ENV.githubApps = {
          appName: process.env.GITHUB_APPS_APP_NAME,
          migrationRepositoryCountLimit: 50
        };
      }
    }

    if (process.env.API_ENDPOINT) {
      ENV.apiEndpoint = process.env.API_ENDPOINT;

      if (ENV.apiEndpoint === 'https://api-staging.travis-ci.org') {
        ENV.pusher.key = 'dd3f11c013317df48b50';
      }

      if (ENV.apiEndpoint === 'https://api-staging.travis-ci.com') {
        ENV.pusher.key = '87d0723b25c51e36def8';
        ENV.billingEndpoint = 'https://billing-staging.travis-ci.com';
      }
    }

    if (process.env.BILLING_ENDPOINT) {
      ENV.billingEndpoint = process.env.BILLING_ENDPOINT;
    }

    if (process.env.PUBLIC_MODE == 'false') {
      ENV.publicMode = false;
    } else {
      ENV.publicMode = true;
    }

    if (process.env.AUTH_ENDPOINT) {
      ENV.authEndpoint = process.env.AUTH_ENDPOINT;
    }

    if (process.env.API_TRACE_ENDPOINT) {
      ENV.apiTraceEndpoint = process.env.API_TRACE_ENDPOINT;
    }

    if (process.env.INTERCOM_APP_ID) {
      ENV.intercom = {
        appId: process.env.INTERCOM_APP_ID,
        enabled: true
      };
    }
  }

  if (environment === 'development') {
    ENV['ember-cli-mirage'] = {
      enabled: false
    };

    ENV.sentry = {
      development: true
    };
  }

  if (environment === 'test') {
    ENV['ember-cli-mirage'] = {
      autostart: true,
    };

    // Testem prefers this...
    ENV.locationType = 'none';

    ENV.validAuthToken = 'testUserToken';

    ENV.intervals.searchDebounceRate = 0;
    ENV.intervals.branchCreatedSyncDelay = 0;
    ENV.intervals.triggerBuildRequestDelay = 0;
    ENV.intervals.fetchRecordsForPusherUpdatesThrottle = 0;
    ENV.intervals.syncingPolling = 10;
    ENV.intervals.githubAppsInstallationPolling = 10;
    ENV.timing.syncingPageRedirectionTime = 30;

    ENV.pagination.dashboardReposPerPage = 10;
    ENV.pagination.profileReposPerPage = 10;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV.liquidFire.enabled = false;

    ENV.sentry = {
      development: true
    };

    ENV.endpoints = {
      sshKey: true,
      caches: true
    };

    ENV.pusher = {};

    ENV.githubApps = {
      appName: 'travis-ci-testing',
      migrationRepositoryCountLimit: 20
    };

    ENV.skipConfirmations = true;

    ENV.logLimit = 100;

    ENV.percy = {
      breakpointsConfig: {
        mobile: 375,
        desktop: 1280
      },
      defaultBreakpoints: ['mobile', 'desktop']
    };

    ENV.featureFlags['debug-logging'] = false;
    ENV.featureFlags['dashboard'] = false;
    ENV.featureFlags['pro-version'] = false;
    ENV.featureFlags['github-apps'] = false;

    ENV.statusPageStatusUrl = undefined;

    ENV.billingEndpoint = 'https://billing.travis-ci.com';
    ENV.apiEndpoint = '';
    ENV.marketplaceEndpoint = 'https://github.com/marketplace/travis-ci/';
  }

  if (environment === 'production') {
    ENV.release = process.env.SOURCE_VERSION || process.env.TRAVIS_COMMIT || '-';
    if (process.env.DISABLE_SENTRY) {
      ENV.sentry = {
        development: true
      };
    }
  }

  if (process.env.DEPLOY_TARGET) {
    var s3Bucket = require('./deploy')(process.env.DEPLOY_TARGET).s3.bucket;
    ENV.emojiPrepend = '//' + s3Bucket + '.s3.amazonaws.com';
  }
  return ENV;
};
