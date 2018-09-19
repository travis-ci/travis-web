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
    autoImport: {
      webpack: {
        // workaround for https://github.com/jeremyfa/yaml.js/issues/102
        node: {
          fs: 'empty'
        },
        module: {
          noParse: /pusher/
        }
      }
    },
    babel: {
      blacklist: ['regenerator'],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
      ]
    },
    favicons: {
      faviconsConfig: {
				appName: 'Travis CI',                                                  // Your application's name. `string`
        appDescription: 'The simplest way to test and deploy your projects.',  // Your application's description. `string`
        developerName: 'Travis CI',                                            // Your (or your developer's) name. `string`
        developerURL: 'https://travis-ci.com',                                 // Your (or your developer's) URL. `string`
        dir: "auto",                                                           // Primary text direction for name, short_name, and description
        lang: "en-US",                                                         // Primary language for name and short_name
        background: "#fff",                                                    // Background colour for flattened icons. `string`
        theme_color: "#fff",                                                   // Theme color user for example in Android's task switcher. `string`
        appleStatusBarStyle: "black-translucent",                              // Style for Apple status bar: "black-translucent", "default", "black". `string`
        display: "standalone",                                                 // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
        orientation: "any",                                                    // Default orientation: "any", "natural", "portrait" or "landscape". `string`
        scope: "/",                                                            // set of URLs that the browser considers within your app
        start_url: "/",                                                        // Start URL when launching the application from a device. `string`
        version: "1.0",                                                        // Your application's version string. `string`
        logging: false,                                                        // Print logs to console? `boolean`
        icons: {
            // Platform Options:
            // - offset - offset in percentage
            // - background:
            //   * false - use default
            //   * true - force use default, e.g. set background for Android icons
            //   * color - set background for the specified icons
            //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
            //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
            //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
            //
            android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            appleStartup: true,         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            coast: false,               // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            favicons: true,             // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            firefox: false,             // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            windows: true,              // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            yandex: false               // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        }
      }
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
    }
  });

  const emojiAssets = new Funnel('node_modules/emoji-datasource-apple/img/apple/64', {
    destDir: '/images/emoji'
  });

  return app.toTree(emojiAssets);
};
