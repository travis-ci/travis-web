import config from 'travis/config/environment';

export function initialize(app) {
  app.register('config:main', config, {
    instantiate: false
  });
  app.inject('controller', 'config', 'config:main');
  app.inject('component', 'config', 'config:main');
  app.inject('route', 'config', 'config:main');
}

export default {
  name: 'config',
  initialize,
};
