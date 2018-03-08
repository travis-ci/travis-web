export function initialize(app) {
  app.inject('application', 'auth', 'service:auth');
}

export default {
  name: 'auth',
  after: 'ember-data',
  initialize,
};
