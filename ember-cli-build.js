/* eslint-env node */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function () {
  var fingerprint;

  if (process.env.DISABLE_FINGERPRINTS) {
    fingerprint = false;
  } else {
    fingerprint = {
      exclude: ['images/emoji'],
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg']
    };

    if (process.env.TRAVIS_ENTERPRISE) {
      fingerprint.prepend = '/';
    } else {
      var assetsHost = process.env.ASSETS_HOST;
      if (assetsHost) {
        if (assetsHost.substr(-1) !== '/') {
          assetsHost = assetsHost + '/';
        }
        fingerprint.prepend = assetsHost;
      } else if (process.env.DEPLOY_TARGET) {
        var s3Bucket = require('./config/deploy')(process.env.DEPLOY_TARGET).s3.bucket;
        fingerprint.prepend = '//' + s3Bucket + '.s3.amazonaws.com/';
      }
    }
  }

  var app = new EmberApp({
    babel: {
      includePolyfill: true,
      optional: ['es7.decorators']
    },
    fingerprint: fingerprint,
    sourcemaps: {
      enabled: false
    },
    'ember-prism': {
      'components': ['scss', 'javascript', 'json'], //needs to be an array, or undefined.
      'plugins': ['line-highlight']
    },
    svg: {
      optimize: false,
      paths: [
        'public/images/stroke-icons',
        'public/images/svg'
      ]
    }
  });

  app.import('bower_components/pusher/dist/pusher.js');
  app.import('bower_components/jquery-timeago/jquery.timeago.js');
  app.import('bower_components/JavaScript-MD5/js/md5.js');
  app.import('bower_components/moment/moment.js');

  app.import('bower_components/js-emoji/demo/emoji.css');
  app.import('bower_components/js-emoji/lib/emoji.js');

  var emojiAssets = new Funnel('bower_components/emoji-data/img-apple-64', {
    destDir: '/images/emoji'
  });

  return app.toTree(emojiAssets);
};
