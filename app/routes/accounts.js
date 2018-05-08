import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';
import { hash } from 'rsvp';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  @service accounts: null,
  @service raven: null,

  model() {
    let compoundFetch = {
      accounts: this.get('accounts').fetch()
    };

    if (config.billingEndpoint) {
      compoundFetch.subscriptions = this.store.findAll('subscription').catch(() => false);
      compoundFetch.subscriptionsFetched = true;
    }

    return hash(compoundFetch).then(({accounts, subscriptions, subscriptionsFetched}) => {
      if (subscriptionsFetched) {
        if (subscriptions) {
          accounts.forEach(account => {
            let login = account.get('login');
            let accountSubscriptions = subscriptions.filter(
              subscription => subscription.get('owner.login') === login &&
                  subscription.get('status') === 'subscribed');

            if (accountSubscriptions.get('length') > 1) {
              let exception =
                new Error(`Account ${login} has more than one active subscription!`);
              this.get('raven').logException(exception, true);
            }

            let chosenSubscription = accountSubscriptions.sortBy('validTo').get('firstObject');
            account.set('subscription', chosenSubscription);
          });
        } else {
          accounts.setEach('subscriptionError', true);
        }
      }

      return accounts;
    });
  },

  setupController(controller, model) {
    let orgs, user;
    user = model.filterBy('type', 'user')[0];
    orgs = model.filterBy('type', 'organization');
    controller.set('user', user);
    controller.set('organizations', orgs);
    return controller.set('model', model);
  },
});
