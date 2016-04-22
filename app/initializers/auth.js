import TestAuth from 'travis/utils/test-auth';
var AuthInitializer, initialize;

initialize = function(app) {
  app.inject('route', 'auth', 'service:auth');
  app.inject('controller', 'auth', 'service:auth');
  app.inject('application', 'auth', 'service:auth');
  app.inject('component', 'auth', 'service:auth');
  return app.inject('service:flashes', 'auth', 'service:auth');
};

AuthInitializer = {
  name: 'auth',
  after: 'ember-data',
  initialize: initialize
};

export {initialize};

export default AuthInitializer;
