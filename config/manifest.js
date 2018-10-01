/* eslint-env node */
'use strict';

module.exports = function (/* environment, appConfig */) {
  // See https://github.com/san650/ember-web-app#documentation for a list of
  // supported properties

  return {
    name: 'Travis CI',
    short_name: 'Travis CI',
    description: 'The simplest way to test and deploy your projects.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.png',
        sizes: '256x256'
      }
    ],
    ms: {
      tileColor: '#fff'
    }
  };
};
