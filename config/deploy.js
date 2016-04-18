var VALID_DEPLOY_TARGETS = [ //update these to match what you call your deployment targets
  'dev',
  'qa',
  'pull-request'
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

  if (deployTarget === 'dev') {
    ENV.build.environment = 'development';
    ENV.redis.url = process.env.REDIS_URL;
    ENV.plugins = ['build', 'redis']; // only care about deploying index.html into redis in dev
  }

  if (deployTarget === 'qa' || deployTarget === 'pull-request') {
    ENV.build.environment = 'production';
    ENV.s3.accessKeyId = process.env.AWS_KEY;
    ENV.s3.secretAccessKey = process.env.AWS_SECRET;
  }

  if (deployTarget === 'qa') {
    ENV.redis.url = process.env.QA_REDIS_URL;
  }

  if (deployTarget === 'pull-request') {
    ENV.redis.keyPrefix = process.env.TRAVIS_PULL_REQUEST_BRANCH_NAME;
    ENV.redis.url = process.env.REDIS_URL;

    ENV.github = {
      token: process.env.GITHUB_TOKEN,
      userOrOrganization: 'travis-ci',
      repo: 'travis-web',
      publicURL: 'https://travis-web-production-next.herokuapp.com/?index_key={{versionSha}}',
      // FIXME is there an environment variable for this?
      commitUser: 'backspace',
      commitSha: process.env.TRAVIS_COMMIT
    };
  }

  return ENV;

  /* Note: a synchronous return is shown above, but ember-cli-deploy
   * does support returning a promise, in case you need to get any of
   * your configuration asynchronously. e.g.
   *
   *    var Promise = require('ember-cli/lib/ext/promise');
   *    return new Promise(function(resolve, reject){
   *      var exec = require('child_process').exec;
   *      var command = 'heroku config:get REDISTOGO_URL --app my-app-' + deployTarget;
   *      exec(command, function (error, stdout, stderr) {
   *        ENV.redis.url = stdout.replace(/\n/, '').replace(/\/\/redistogo:/, '//:');
   *        if (error) {
   *          reject(error);
   *        } else {
   *          resolve(ENV);
   *        }
   *      });
   *    });
   *
   */
}
