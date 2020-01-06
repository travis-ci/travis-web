module.exports = function (env) {
  return {
    clientAllowedKeys: [
      'API_ENDPOINT',
      'TRAVIS_PRO',
      'BITBUCKET_LOGIN',
    ],
    failOnMissingKey: false,
  };
};
