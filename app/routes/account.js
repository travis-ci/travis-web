import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  titleToken(model) {
    const account = model.account;

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
      let modelHash = {
        account
      };
      // FIX ME
      if (account.get('login') === 'feministkilljoy') {
        modelHash.subscription = this.store.findRecord('subscription', '1');
      }
      return hash(modelHash);
    }

    return {
      login,
      error: true
    };
  },

  serialize(model) {
    const account = model.account;

    if (account && account.get) {
      return {
        login: account.get('login')
      };
    } else {
      return {};
    }
  }
});
