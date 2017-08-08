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
    const { login } = params;
    return this.modelFor('accounts')
      .find(acct => acct.get('login') === login);
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
