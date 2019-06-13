'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');
const SVGO = require('svgo');
const Sass = require('node-sass');

module.exports = function () {
  let fingerprint;

  if (process.env.DISABLE_FINGERPRINTS) {
    fingerprint = false;
  } else {
    fingerprint = {
      exclude: ['images/emoji', 'images/logos'],
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
    fingerprint: fingerprint,
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    },
    'ember-prism': {
      'components': ['yaml'],
    },
    sassOptions: {
      implementation: Sass
    },
    svg: {
      optimize: false,
      paths: [
        'public/images/stroke-icons',
        'public/images/svg'
      ]
    },
    svgJar: {
      optimizer: {
        svgoModule: SVGO,
        plugins: [
          { removeViewBox: false },
          { removeTitle: false },
          { removeDesc: false },
          {
            inlineStyles: {
              onlyMatchedOnce: false,
              removeMatchedSelectors: true
            }
          }
        ]
      }
    },
    'ember-composable-helpers': {
      only: ['sort-by', 'compute', 'contains']
    },
    'ember-power-select': {
      theme: false
    }
  });

  const emojiAssets = new Funnel('node_modules/emoji-datasource-apple/img/apple/64', {
    destDir: '/images/emoji'
  });

  importNpmDependency(app, 'node_modules/fuzzysort/fuzzysort.js');
  importNpmDependency(app, 'node_modules/pusher-js/dist/web/pusher.js');
  importNpmDependency(app, 'node_modules/raven-js/dist/raven.js');
  importNpmDependency(app, 'node_modules/emoji-js/lib/emoji.js');
  importNpmDependency(app, 'node_modules/visibilityjs/index.js');
  importNpmDependency(app, 'node_modules/ansiparse/lib/ansiparse.js', 'amd');
  importNpmDependency(app, 'node_modules/yamljs/index.js');

  return app.toTree(emojiAssets);
};

function importNpmDependency(app, path, transformation = 'cjs', alias) {
  const as = alias || path.split('/')[1];
  app.import(path, { using: [{ transformation, as }] });
}
