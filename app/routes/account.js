import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service raven: null,

  titleToken({account}) {
    if (account && account.id) {
      return account.get('name') || account.get('login');
    } else {
      return 'Account';
    }
  },

  model(params) {
    const { login } = params;
    let account = this
      .modelFor('accounts')
      .find(acct => acct.get('login') === login);
    if (account) {
      return {
        account
      };
    }

    return {
      login,
      error: true
    };
  },

  serialize({account}) {
    if (account && account.get) {
      return {
        login: account.get('login')
      };
    } else {
      return {};
    }
  },

  setupController(controller, model) {
    if (model.error) {
      controller.set('model', model);
    } else {
      controller.set('model', model.account);
    }
  }
});
