import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    return this.modelFor('account.billing');
  },

  // FIXME without this, the same subscription was used for all user/orgs?!
  setupController(controller, model) {
    controller.set('model', model);
  }
});
