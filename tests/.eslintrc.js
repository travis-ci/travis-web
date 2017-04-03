module.exports = {
  env: {
    'browser': true,
    'embertest': true,
    'qunit': true
  },
  globals: {
    server: true,
    signInUser: true,
    withFeature: true,
    percySnapshot: true,
    waitForElement: true
  },
  rules: {
    'max-len': 0,
    embertest: true
  }
};
