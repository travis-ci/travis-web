'use strict';

module.exports = {
  scenarios: [
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-source': 'beta'
        }
      }
    },
    {
      name: 'ember-data-beta',
      npm: {
        devDependencies: {
          'ember-data': 'beta'
        }
      }
    }
  ],
};
