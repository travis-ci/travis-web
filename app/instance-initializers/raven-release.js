import config from 'travis/config/environment';

export function initialize(appInstance) {
  if (config.environment === 'production') {
    let sha = process.env.SOURCE_VERSION || "-"
  } else {
    let sha = appInstance.application.version.slice(6, -1);
  }
  console.log(sha);

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
