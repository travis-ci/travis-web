var VALID_DEPLOY_TARGETS = [
  'org-staging-pull-request',
  'org-production-pull-request',
  'com-staging-pull-request',
  'com-production-pull-request',
  'org-beta',
  'com-beta',
  'org-canary',
  'com-canary'
];

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: 'production'
    },
    redis: {
      allowOverwrite: true,
      keyPrefix: process.env.CLEANED_BRANCH_SUBDOMAIN
    },
    s3: {
      region: 'eu-west-1',
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET
    }
  };

  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget === 'org-production-pull-request' ||
      deployTarget === 'org-canary' ||
      deployTarget === 'org-beta') {
    ENV.s3.bucket = 'travis-web-production-next';
    ENV.redis.url = process.env.ORG_PRODUCTION_REDIS_URL;
  }

  if (deployTarget === 'org-staging-pull-request') {
    ENV.s3.bucket = 'travis-web-production-next';
    ENV.redis.url = process.env.ORG_PRODUCTION_REDIS_URL;
    ENV.redis.keyPrefix = `${process.env.CLEANED_BRANCH_SUBDOMAIN}-staging`;
  }

  if (deployTarget === 'com-production-pull-request' ||
      deployTarget === 'com-canary' ||
      deployTarget === 'com-beta') {
    ENV.s3.bucket = 'travis-pro-web-production-next';
    ENV.redis.url = process.env.COM_PRODUCTION_REDIS_URL;
  }

  if (deployTarget === 'com-staging-pull-request') {
    ENV.s3.bucket = 'travis-pro-web-production-next';
    ENV.redis.url = process.env.COM_PRODUCTION_REDIS_URL;
    ENV.redis.keyPrefix = `${process.env.CLEANED_BRANCH_SUBDOMAIN}-staging`;
  }

  return ENV;
};
