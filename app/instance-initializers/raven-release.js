import config from 'travis/config/environment';

export function initialize(/* appInstance */) {
  let env = window.location.href;
  let sha = config.APP.version.slice(6, -1);
  let domain = env === 'https://travis-ci.org' ? 'org' : 'com';
  let release = `${domain}-${sha}`;

  window.Raven.setRelease(release);
}

export default {
  name: 'raven-release',
  after: 'sentry-setup',
  initialize
};
