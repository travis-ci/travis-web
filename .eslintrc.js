var path = require('path');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  env: {
    'browser': true
  },
  rules: {
  },
  globals: {
  }
};
