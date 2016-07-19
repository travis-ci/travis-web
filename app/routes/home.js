import BasicRoute from 'travis/routes/basic';

export default BasicRoute.extend({

  activate() {
    return this.controllerFor('top').set('landingPage', true);
  },

  deactivate() {
    return this.controllerFor('top').set('landingPage', false);
  },

  setupController(controller/* , model*/) {
    return controller.set('repos', this.get('repos'));
  }
});
