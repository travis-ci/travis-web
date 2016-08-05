/* eslint-env node */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

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
    fingerprint: fingerprint,
    sourcemaps: {
      enabled: false
    },
    vendorFiles: {
      // next line is needed to prevent ember-cli to load
      // handlebars (it happens automatically in 0.1.x)
      'handlebars.js': null
    },
    'ember-prism': {
      'components': ['scss', 'javascript', 'json'], //needs to be an array, or undefined.
      'plugins': ['line-highlight']
    }
  });

  app.import('vendor/babel-polyfill.js', { prepend: true });
  app.import('bower_components/pusher/dist/pusher.js');
  app.import('bower_components/jquery-timeago/jquery.timeago.js');
  app.import('bower_components/visibilityjs/lib/visibility.core.js');
  app.import('bower_components/visibilityjs/lib/visibility.timers.js');
  app.import('bower_components/JavaScript-MD5/js/md5.js');
  app.import('vendor/ansiparse.js');
  app.import('vendor/log.js');
  app.import('vendor/customerio.js');
  app.import('bower_components/moment/moment.js');

  return app.toTree();
};
