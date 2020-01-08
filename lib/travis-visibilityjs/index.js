'use strict';

const map = require('broccoli-stew').map;
const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const path = require('path');

const visibilityjsPath = path.join(path.dirname(require.resolve('visibilityjs')), 'lib');

module.exports = {
  name: require('./package').name,

  treeForVendor(vendorTree) {
    const trees = [];

    if (vendorTree) {
      trees.push(vendorTree);
    }

    trees.push(
      funnel(visibilityjsPath, {
        destDir: 'visibilityjs',
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
    app.import('vendor/visibilityjs/visibility.core.js');
    app.import('vendor/visibilityjs/visibility.timers.js');
  },

  isDevelopingAddon() {
    return true;
  }
};
