import config from 'travis/config/environment';

export function initialize(app) {
  app.register('config:main', config, {
    instantiate: false
  });
}

export default {
  name: 'config',
  initialize,
};
