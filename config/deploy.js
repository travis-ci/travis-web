var VALID_DEPLOY_TARGETS = [
  'pull-request',
];

module.exports = function(deployTarget) {
  var ENV = {
    build: {},
    redis: {
      allowOverwrite: true,
      keyPrefix: 'travis:index'
    },
    s3: {
      bucket: 'travis-web-production-next',
      region: 'eu-west-1'
    }
  };

  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget === 'pull-request') {
    ENV.build.environment = 'production';
    ENV.s3.accessKeyId = process.env.AWS_KEY;
    ENV.s3.secretAccessKey = process.env.AWS_SECRET;

    ENV.redis.keyPrefix = process.env.TRAVIS_PULL_REQUEST_BRANCH;
    ENV.redis.url = process.env.REDIS_URL;
  }

  return ENV;
};
