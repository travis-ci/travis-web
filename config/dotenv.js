module.exports = function (env) {
  return {
    clientAllowedKeys: [
      'API_ENDPOINT',
      'YML_ENDPOINT',
      'TRAVIS_PRO',
      'ENABLE_FEATURE_FLAGS',
    ],
    failOnMissingKey: false,
  };
};
