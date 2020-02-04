module.exports = function (env) {
  return {
    clientAllowedKeys: [
      'API_ENDPOINT',
      'YML_ENDPOINT',
      'TRAVIS_PRO',
    ],
    failOnMissingKey: false,
  };
};
