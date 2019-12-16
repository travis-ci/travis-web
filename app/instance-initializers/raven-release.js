import config from 'travis/config/environment';
import Raven from 'raven-js';
import { isFastboot } from 'travis/utils/fastboot';

export function initialize(appInstance) {
  let sha;
  // this is Heroku-specific, will not work in other environments
  if (config.environment === 'production') {
    sha = config.release.slice(0, 7);
  } else {
    sha = appInstance.application.version.slice(6, -1);
  }

  let env = '';
  if (isFastboot) {
    const fastboot = appInstance.lookup('service:fastboot');
    env = fastboot.request.host;
  } else {
    env = window.location.href;
  }
  let domain = env.includes('.org') ? 'org' : 'com';
  let release = `${domain}-${sha}`;

  Raven.setRelease(release);
}

export default {
  name: 'raven-release',
  after: 'sentry-setup',
  initialize
};
