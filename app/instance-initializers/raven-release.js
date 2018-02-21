export function initialize(appInstance) {
  window.Raven.setRelease('fastboot');
}

export default {
  name: 'raven-release',
  after: 'sentry-setup',
  initialize
};
