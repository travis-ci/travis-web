export function initialize(app) {
  app.inject('route', 'auth', 'service:auth');
  app.inject('controller', 'auth', 'service:auth');
  app.inject('application', 'auth', 'service:auth');
  app.inject('component', 'auth', 'service:auth');
}

export default {
  name: 'auth',
  after: 'ember-data',
  initialize,
};
