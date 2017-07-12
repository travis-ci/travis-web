/* eslint-env node */
const isMacOS = /^darwin/.test(process.platform);
const isWindows = /^win/.test(process.platform);

let browserArgs;

if (isMacOS || isWindows) {
  browserArgs = [];
} else {
  browserArgs = ['--headless', '--disable-gpu', '--remote-debugging-port=9222'];
}

module.exports = {
  framework: 'qunit',
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_args: {
    'Chrome': browserArgs,
  },
};
