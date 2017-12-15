module.exports = {
  env: {
    browser: true,
    embertest: true,
    qunit: true,
    es6: true
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
    'no-useless-escape': 0,
  }
};
