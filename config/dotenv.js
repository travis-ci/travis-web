module.exports = function (env) {
  return {
    clientAllowedKeys: [
      'API_ENDPOINT',
      'TRAVIS_PRO',
      'ENABLED_DEV_FLAGS',
    ],
    failOnMissingKey: false,
  };
};
