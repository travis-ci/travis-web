import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    let accountCompound = this.modelFor('account');
    return accountCompound.account.get('subscription') ||
      accountCompound.account.get('expiredSubscription') ||
      accountCompound.account.get('canceledSubscription');
  },

  // without this, switching between accounts doesn’t update the billing information?!
  setupController(controller, model) {
    controller.set('model', model);
  }
});
