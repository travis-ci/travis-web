'use strict';

const map = require('broccoli-stew').map;
const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const path = require('path');

const pusherPath = path.join(path.dirname(require.resolve('pusher-js')), '../web');

module.exports = {
  name: require('./package').name,

  treeForVendor(vendorTree) {
    const trees = [];

    if (vendorTree) {
      trees.push(vendorTree);
    }

    trees.push(
      funnel(pusherPath, {
        destDir: 'pusher',
        include: [new RegExp(/\.js$/)],
      })
    );

    return map(
      mergeTrees(trees),
      content => `if (typeof FastBoot === 'undefined') { ${content} }`
    );
  },

  included(app) {
    this._super.included.apply(this, arguments);
    app.import(
      {
        development: 'vendor/pusher/pusher.js',
        production: 'vendor/pusher/pusher.min.js'
      },
      { prepend: true }
    );
  },

  isDevelopingAddon() {
    return true;
  }
};
