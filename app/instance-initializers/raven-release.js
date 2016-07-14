import config from 'travis/config/environment';

export function initialize(appInstance) {
  let sha;
  // this is Heroku-specific, will not work in other environments
  if (config.environment === 'production') {
    sha = config.release.slice(0, 7);
  } else {
    sha = appInstance.application.version.slice(6, -1);
  }

  let env = window.location.href;
  let domain = env.includes('.org') ? 'org' : 'com';
  let release = `${domain}-${sha}`;

  window.Raven.setRelease(release);
}

export default {
  name: 'raven-release',
  after: 'sentry-setup',
  initialize
};
