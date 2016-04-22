import config from 'travis/config/environment';
var ConfigInitializer, initialize;

initialize = function(application) {
  application.register('config:main', config, {
    instantiate: false
  });
  application.inject('controller', 'config', 'config:main');
  application.inject('component', 'config', 'config:main');
  return application.inject('route', 'config', 'config:main');
};

ConfigInitializer = {
  name: 'config',
  initialize: initialize
};

export {initialize};

export default ConfigInitializer;
