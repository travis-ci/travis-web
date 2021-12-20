/* eslint-env node */
'use strict';

const providers = require('./providers');
const { plans } = require('./plans.js');
const { screens } = require('./screens.js');
const newInsights = require('./new-insights');

const tailwindConfig = require('./tailwind.js');
const resolveTwConfig = require('tailwindcss/resolveConfig');
const tailwind = resolveTwConfig(tailwindConfig);

const {
  TRAVIS_PRO,
  TRAVIS_ENTERPRISE,
  SOURCE_ENDPOINT,
  ENABLE_FEATURE_FLAGS,
  GOOGLE_ANALYTICS_ID,
  GOOGLE_TAGS_CONTAINER_ID,
  GOOGLE_TAGS_PARAMS,
  STRIPE_PUBLISHABLE_KEY,
  GITHUB_APPS_APP_NAME,
  API_ENDPOINT,
  BILLING_ENDPOINT,
  PUBLIC_MODE,
  AUTH_ENDPOINT,
  API_TRACE_ENDPOINT,
  INTERCOM_APP_ID,
  DISABLE_SENTRY,
  TRAVIS_COMMIT,
  SOURCE_VERSION,
  DEPLOY_TARGET
} = process.env;

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'travis',
    environment,
    rootURL: '/',
    locationType: 'auto',
    defaultTitle: 'Travis CI',
    providers,
    plans,
    screens,
    newInsights,
    tailwind,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
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
    githubAppsEndpoint: 'https://github.com/apps',

    pusher: {
      key: '5df8ac576dcccf4fd076',
      host: 'ws.pusherapp.com',
      debug: false
    },
    intercom: {
      appId: INTERCOM_APP_ID || 'placeholder',
      enabled: !!INTERCOM_APP_ID,
      userProperties: {
        userIdProp: 'id',
        emailProp: 'email',
        nameProp: 'name',
        createdAtProp: 'firstLoggedInAt',
        userHashProp: 'secureUserHash',
      }
    },
    urls: {
      about: 'https://about.travis-ci.com',
      bestpracticessecurity: 'https://docs.travis-ci.com/user/best-practices-security#recommendations-on-how-to-avoid-leaking-secrets-to-build-logs',
      blog: 'https://blog.travis-ci.com',
      buildMatrix: 'https://docs.travis-ci.com/user/build-matrix/',
      buildConfigValidation: 'https://docs.travis-ci.com/user/build-config-validation/',
      caseStudy: 'https://blog.travis-ci.com/2019-06-5-case-study-ibm-cloud-kubernetes-service',
      changelog: 'https://changelog.travis-ci.com',
      community: 'https://travis-ci.community',
      communityEarlyReleases: 'https://travis-ci.community/c/early-releases',
      dashboard: 'https://travis-ci.com/dashboard',
      docker: 'https://docs.travis-ci.com/user/docker/',
      docs: 'https://docs.travis-ci.com',
      gettingStarted: 'https://docs.travis-ci.com/user/getting-started/#to-get-started-with-travis-ci',
      education: 'https://education.travis-ci.com',
      emailSupport: 'mailto:support@travis-ci.com',
      enterprise: 'https://enterprise.travis-ci.com',
      imprint: 'https://docs.travis-ci.com/imprint.html',
      legal: 'https://ideracorp.com/legal/TravisCI',
      jobs: 'https://travisci.workable.com/',
      languages: 'https://docs.travis-ci.com/user/language-specific/',
      multiOS: 'https://docs.travis-ci.com/user/multi-os/',
      node: 'https://docs.travis-ci.com/user/languages/javascript-with-nodejs/',
      noRun: 'https://docs.travis-ci.com/user/common-build-problems/#i-pushed-a-commit-and-cant-fin',
      plans: 'https://travis-ci.com/plans',
      status: 'https://www.traviscistatus.com/',
      support: 'mailto:support@travis-ci.com',
      travisVsJenkins: 'https://travis-ci.com/travisci-vs-jenkins',
      tutorial: 'https://docs.travis-ci.com/user/tutorial/',
      twitter: 'https://twitter.com/travisci',
      pardotHost: 'https://info.travis-ci.com',
      pardotForm: '/l/845883/2020-02-03/257j',
      planDocs: 'https://docs.travis-ci.com/user/billing-overview/',
      planCreditDocs: 'https://docs.travis-ci.com/user/billing-overview/#usage---credits',
      planUsersDocs: 'https://docs.travis-ci.com/user/billing-overview/#usage---user-licenses',
    },
    endpoints: {},
    githubApps: false,
    timing: {
      syncingPageRedirectionTime: 5000,
      utmParametersResetDelay: 1000,
    },
    intervals: {
      updateTimes: 1000,
      branchCreatedSyncDelay: 2000,
      searchDebounceRate: 500,
      triggerBuildRequestDelay: 3000,
      fetchRecordsForPusherUpdatesThrottle: 1000,
      repositoryFilteringDebounceRate: 200,
      syncingPolling: 3000,
      githubAppsInstallationPolling: 4000,
    },
    apiTraceEndpoint: 'https://papertrailapp.com/systems/travis-org-api-production/events?q=program%3Aapp%2Fweb%20log-tracing%20',
    ajaxPolling: false,
    logLimit: 100000,
    emojiPrepend: '',
    statusPageStatusUrl: 'https://pnpcptp8xh9k.statuspage.io/api/v2/status.json',

    zendesk: {
      apiHost: 'https://travisci.zendesk.com',
      createRequestEndpoint: '/api/v2/requests.json'
    },

    moment: {
      includeTimezone: 'subset'
    },

    stripeOptions: {
      hidePostalCode: true,
      style: {
        base: {
          fontStyle: 'Source Sans Pro',
          fontSize: '15px',
          color: '#666',
          '::placeholder': {
            color: '#aaa'
          },
        },
        invalid: {
          color: 'red',
          iconColor: 'red'
        }
      }
    },

    insightsStatusUrls: [
      { name: '1Password', url: 'https://1password.statuspage.io' },
      { name: 'Amazon Web Services', url: 'https://status.aws.amazon.com' },
      { name: 'Artifactory', url: 'https://status.jfrog.io' },
      { name: 'Assembla', url: 'https://status.assembla.com' },
      { name: 'Azure', url: 'https://status.azure.com/en-us/status' },
      { name: 'Bamboo', url: 'https://status.atlassian.com' },
      { name: 'Bitbucket', url: 'https://bitbucket.status.atlassian.com' },
      { name: 'CircleCI', url: 'https://status.circleci.com' },
      { name: 'Cloudbees', url: 'https://www.cloudbeesstatus.com' },
      { name: 'Cloudflare', url: 'https://www.cloudflarestatus.com' },
      { name: 'Codeclimate', url: 'https://statusgator.com/services/code-climate' },
      { name: 'Datadog', url: 'https://status.datadoghq.com' },
      { name: 'GitHub', url: 'https://www.githubstatus.com' },
      { name: 'GitLab', url: 'https://status.gitlab.com' },
      { name: 'Godaddy', url: 'https://statusgator.com/services/godaddy' },
      { name: 'Google Cloud Platform', url: 'https://status.cloud.google.com' },
      { name: 'Heroku', url: 'https://status.heroku.com' },
      { name: 'New Relic', url: 'https://status.newrelic.com' },
      { name: 'Okta', url: 'https://status.okta.com/' },
      { name: 'Onelogin', url: 'https://www.onelogin.com/status' },
      { name: 'Pagerduty', url: 'https://status.pagerduty.com' },
      { name: 'Pingdom', url: 'https://status.pingdom.com' },
      { name: 'Rollbar', url: 'https://status.rollbar.com' },
      { name: 'Sentry', url: 'https://status.sentry.io' },
      { name: 'TeamCity', url: 'https://status.jetbrains.com' },
      { name: 'Travis CI', url: 'https://www.traviscistatus.com' },
      { name: 'Zendesk', url: 'https://status.zendesk.com' },
    ],
  };

  ENV.metricsAdapters = [];
  if (GOOGLE_ANALYTICS_ID) {
    ENV.metricsAdapters.push({
      name: 'GoogleAnalytics',
      environments: ['development', 'production'],
      config: {
        id: GOOGLE_ANALYTICS_ID,
        // Use `analytics_debug.js` in development
        debug: environment === 'development',
        // Use verbose tracing of GA events
        trace: environment === 'development',
        // Ensure development env hits aren't sent to GA
        sendHitTask: environment !== 'development',
      }
    });
  }

  if (GOOGLE_TAGS_CONTAINER_ID) {
    ENV.metricsAdapters.push({
      name: 'GoogleTagManager',
      config: {
        id: GOOGLE_TAGS_CONTAINER_ID,
        envParams: GOOGLE_TAGS_PARAMS,
      }
    });
  }

  ENV.featureFlags = {
    'repository-filtering': true,
    'debug-logging': false,
    'landing-page-cta': true,
    'show-running-jobs-in-sidebar': false,
    'debug-builds': false,
    'broadcasts': true,
    'beta-features': true,
    'github-apps': false,
    'enable-assembla-login': false,
    'enable-bitbucket-login': false,
    'enable-gitlab-login': false,
    'gitlab-login': false,
  };

  if (TRAVIS_PRO) {
    ENV.featureFlags['pro-version'] = true;
    ENV.featureFlags['github-apps'] = true;
    ENV.pro = true;
  }

  if (TRAVIS_ENTERPRISE) {
    ENV.featureFlags['enterprise-version'] = true;
    ENV.enterprise = true;
    if (SOURCE_ENDPOINT) {
      ENV.sourceEndpoint = SOURCE_ENDPOINT;
    }
  }

  ENV.pagination = {
    dashboardReposPerPage: 25,
    profileReposPerPage: 25,
    repoBuildsPerPage: 25,
  };

  if (STRIPE_PUBLISHABLE_KEY) {
    ENV.stripe = {
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      lazyLoad: true,
    };
  }

  try {
    Object.keys(ENV.featureFlags).forEach(flagKey => {
      const envFlagName = `FLAG_${flagKey.toUpperCase().replace(/-/g, '_')}`;
      const envFlagVal = process.env[envFlagName];

      if (envFlagVal === 'true') {
        ENV.featureFlags[flagKey] = true;
      } else if (envFlagVal === 'false') {
        ENV.featureFlags[flagKey] = false;
      }
    });
  } catch (e) {}

  if (ENABLE_FEATURE_FLAGS) {
    try {
      const devFlags = ENABLE_FEATURE_FLAGS.split(',');
      if (devFlags.length) {
        devFlags.forEach(flagKey => {
          ENV.featureFlags[flagKey] = true;
        });
      }
    } catch (e) {}
  }

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
      ENV.pagesEndpoint = 'https://travis-ci.com/account/plan';
      ENV.billingEndpoint = 'https://travis-ci.com';
      ENV.marketplaceEndpoint = 'https://github.com/marketplace/travis-ci/';
      ENV.endpoints = {
        sshKey: true,
        caches: true
      };
      ENV.userlike = true;

      if (GITHUB_APPS_APP_NAME) {
        ENV.githubApps = {
          appName: GITHUB_APPS_APP_NAME,
          migrationRepositoryCountLimit: 50
        };
      }
    }

    if (API_ENDPOINT) {
      ENV.apiEndpoint = API_ENDPOINT;

      if (ENV.apiEndpoint === 'https://api-staging.travis-ci.org') {
        ENV.pusher.key = 'dd3f11c013317df48b50';
      }

      if (ENV.apiEndpoint === 'https://api-staging.travis-ci.com') {
        ENV.pusher.key = '87d0723b25c51e36def8';
        ENV.billingEndpoint = 'https://staging.travis-ci.com';
      }
    }
    if (SOURCE_ENDPOINT && !SOURCE_ENDPOINT.indexOf('github.com')) {
      ENV.githubAppsEndpoint = SOURCE_ENDPOINT + '/github-apps';
    }
    if (BILLING_ENDPOINT) {
      ENV.billingEndpoint = BILLING_ENDPOINT;
    }

    if (PUBLIC_MODE == 'false') {
      ENV.publicMode = false;
    } else {
      ENV.publicMode = true;
    }

    if (AUTH_ENDPOINT) {
      ENV.authEndpoint = AUTH_ENDPOINT;
    }

    if (API_TRACE_ENDPOINT) {
      ENV.apiTraceEndpoint = API_TRACE_ENDPOINT;
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
    // Testem prefers this...
    ENV.locationType = 'none';

    ENV.validAuthToken = 'testUserToken';

    ENV.intervals.searchDebounceRate = 0;
    ENV.intervals.branchCreatedSyncDelay = 0;
    ENV.intervals.triggerBuildRequestDelay = 0;
    ENV.intervals.fetchRecordsForPusherUpdatesThrottle = 0;
    ENV.intervals.syncingPolling = 0;
    ENV.intervals.githubAppsInstallationPolling = 10;
    ENV.timing.syncingPageRedirectionTime = 30;
    ENV.timing.utmParametersResetDelay = 10;

    ENV.pagination.dashboardReposPerPage = 10;
    ENV.pagination.profileReposPerPage = 10;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV.sentry = {
      development: true
    };

    ENV.endpoints = {
      sshKey: true,
      caches: true
    };

    ENV.stripe = {
      publishableKey: 'pk_test_5i2Bx5nJACluilHLb25d3P9N',
      lazyLoad: true,
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

    ENV.billingEndpoint = 'https://travis-ci.com';
    ENV.apiEndpoint = '';
    ENV.marketplaceEndpoint = 'https://github.com/marketplace/travis-ci/';
  }

  if (environment === 'production') {
    ENV.release = SOURCE_VERSION || TRAVIS_COMMIT || '-';
    if (DISABLE_SENTRY) {
      ENV.sentry = {
        development: true
      };
    }
  }

  if (DEPLOY_TARGET) {
    var s3Bucket = require('./deploy')(DEPLOY_TARGET).s3.bucket;
    ENV.emojiPrepend = '//' + s3Bucket + '.s3.amazonaws.com';
  }
  return ENV;
};
