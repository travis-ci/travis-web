'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');

module.exports = function () {
  let fingerprint;

  if (process.env.DISABLE_FINGERPRINTS) {
    fingerprint = false;
  } else {
    fingerprint = {
      // FIXME this is probably not desired
      exclude: ['images/emoji', 'images/logos', 'images/pro-landing/flag*', 'images/team'],
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg']
    };

    if (process.env.TRAVIS_ENTERPRISE) {
      fingerprint.prepend = '/';
    } else {
      let assetsHost = process.env.ASSETS_HOST;
      if (assetsHost) {
        if (assetsHost.substr(-1) !== '/') {
          assetsHost = assetsHost + '/';
        }
        fingerprint.prepend = assetsHost;
      } else if (process.env.DEPLOY_TARGET) {
        const s3Bucket = require('./config/deploy')(process.env.DEPLOY_TARGET).s3.bucket;
        fingerprint.prepend = '//' + s3Bucket + '.s3.amazonaws.com/';
      }
    }
  }

  const app = new EmberApp({
    'ember-cli-babel': {
      includePolyfill: true,
    },
    babel: {
      blacklist: ['regenerator'],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
      ]
    },
    fingerprint: fingerprint,
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    },
    'ember-prism': {
      'components': ['scss', 'javascript', 'json'], // needs to be an array, or undefined.
      'plugins': ['line-highlight']
    },
    svg: {
      optimize: false,
      paths: [
        'public/images/stroke-icons',
        'public/images/svg'
      ]
    },
    sassOptions: {
      extensions: 'sass'
    }
  });

  app.import('bower_components/pusher/dist/pusher.js');
  app.import('node_modules/timeago/jquery.timeago.js');

  app.import('bower_components/waypoints/lib/jquery.waypoints.js');
  app.import('bower_components/waypoints/lib/shortcuts/inview.js');

  const emojiAssets = new Funnel('node_modules/emoji-datasource-apple/img/apple/64', {
    destDir: '/images/emoji'
  });

  return app.toTree(emojiAssets);
};
