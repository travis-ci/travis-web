import config from 'travis/config/environment';

export function initialize(appInstance) {
  let sha = config.currentRevision.slice(0,7);
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
