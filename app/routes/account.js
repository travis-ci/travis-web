import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

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
      if (config.billingEndpoint) {
        return this.store.findAll('subscription')
          .then(subscriptions => {
            let accountSubscriptions = subscriptions.filter(
              subscription => subscription.get('owner.login') === login &&
                  subscription.get('status') === 'subscribed');

            if (accountSubscriptions.get('length') > 1) {
              let exception =
                new Error(`Account ${login} has more than one active subscription!`);
              this.get('raven').logException(exception, true);
            }

            return accountSubscriptions.sortBy('validTo').get('firstObject');
          }).then(subscription => ({
            account,
            subscription
          })).catch(() => ({
            account,
            subscriptionError: true
          }));
      } else {
        return { account };
      }
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
      controller.set('subscription', model.subscription);
      controller.set('subscriptionError', model.subscriptionError);
    }
  }
});
