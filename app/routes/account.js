import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken(model) {
    if (model && model.id) {
      return model.get('name') || model.get('login');
    } else {
      return 'Account';
    }
  },

  setupController(controller) {
    this._super(...arguments);
    controller.reloadOwnerRepositories();
  },

  model(params) {
    const { login } = params;
    let account = this.modelFor('accounts')
      .find(acct => acct.get('login') === login);
    if (account) {
      return account;
    } else {
      return { login, error: true };
    }
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
