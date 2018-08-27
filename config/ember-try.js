'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function () {
  return Promise.all([
    getChannelURL('beta'),
    getChannelURL('canary')
  ]).then(([beta, canary]) => {
    return {
      scenarios: [
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-source': beta
            }
          }
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: {
              'ember-source': canary
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
  });
};
