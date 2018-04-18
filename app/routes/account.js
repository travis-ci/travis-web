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
      return this.store.findAll('subscription')
        .then(subscriptions => {
          let accountSubscriptions = subscriptions.filter(
            subscription => subscription.get('owner.login') === login &&
                subscription.get('status') === 'subscribed');

          if (accountSubscriptions.get('length') > 1) {
            // FIXME remember the test for this
            let exception =
              new Error(`Account ${login} has more than one active subscription!`);
            this.get('raven').logException(exception, true);
          }

          return accountSubscriptions.sortBy('validTo').get('firstObject');
        }).then(subscription => ({
          account,
          subscription
        }));
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
    controller.set('model', model.account);
    controller.set('subscription', model.subscription);
  }
});
