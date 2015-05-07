/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var fingerprint,
    assetsHost;

if (process.env.DISABLE_FINGERPRINTS) {
  fingerprint = false;
} else {
  fingerprint = {
    extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg']
  };

  if (assetsHost = process.env.ASSETS_HOST) {
    if (assetsHost.substr(-1) !== '/') {
      assetsHost = assetsHost + '/'
    }
    fingerprint.prepend = assetsHost
  }
}

var app = new EmberApp({
  fingerprint: fingerprint,
  vendorFiles: {
    // next line is needed to prevent ember-cli to load
    // handlebars (it happens automatically in 0.1.x)
    'handlebars.js': null
  }
});

app.import('bower_components/pusher/dist/pusher.js');
app.import('bower_components/jquery-timeago/jquery.timeago.js');
app.import('bower_components/visibilityjs/lib/visibility.core.js');
app.import('bower_components/visibilityjs/lib/visibility.timers.js');
app.import('bower_components/JavaScript-MD5/js/md5.js');
app.import('vendor/ansiparse.js');
app.import('vendor/log.js');
app.import('vendor/customerio.js');
app.import('vendor/charmscout.js');
app.import('bower_components/moment/moment.js');
// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
