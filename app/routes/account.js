import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken(model) {
    if (model) {
      return model.get('name') || model.get('login');
    } else {
      return 'Account';
    }
  },

  setupController(controller) {
    this._super(...arguments);
    controller.reloadHooks();
  },

  model(params) {
    return this.modelFor('accounts').find(function (account) {
      return account.get('login') === params.login;
    });
  },

  serialize(account) {
    if (account && account.get) {
      return {
        login: account.get('login')
      };
    } else {
      return {};
    }
  }
});
