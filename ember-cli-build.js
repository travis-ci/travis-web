/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var fingerprint,
      assetsHost;

  var s3Bucket = require('./config/deploy')('pull-request').s3.bucket;

  if (process.env.DISABLE_FINGERPRINTS) {
    fingerprint = false;
  } else {
    fingerprint = {
      exclude: ['images/emoji'],
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg'],
      prepend: '//' + s3Bucket + '.s3.amazonaws.com/',
    };
  }

  var app = new EmberApp({
    fingerprint: fingerprint,
    vendorFiles: {
      // next line is needed to prevent ember-cli to load
      // handlebars (it happens automatically in 0.1.x)
      'handlebars.js': null
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
