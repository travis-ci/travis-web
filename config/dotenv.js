module.exports = function (env) {
  return {
    clientAllowedKeys: [
      'API_ENDPOINT',
      'TRAVIS_PRO',
      'TRAVIS_ENTERPRISE',
    ],
    failOnMissingKey: false,
  };
};
