export function initialize(appInstance) {
  let sha = appInstance.application.version.slice(6, -1);
  let env = window.location.href;
  let domain = env === 'https://travis-ci.org/' ? 'org' : 'com';
  let release = `${domain}-${sha}`;

  window.Raven.setRelease(release);
}

export default {
  name: 'raven-release',
  after: 'sentry-setup',
  initialize
};
