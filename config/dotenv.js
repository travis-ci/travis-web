module.exports = function (env) {
  return {
    clientAllowedKeys: [
      'API_ENDPOINT',
      'STRIPE_PUBLISHABLE_KEY',
      'TRAVIS_PRO',
      'TRAVIS_ENTERPRISE'
    ],
    failOnMissingKey: false,
  };
};
