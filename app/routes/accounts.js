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
      compoundFetch.trials = this.store.findAll('trial').catch(() => false);
      compoundFetch.trialsFetched = true;
    }

    return hash(compoundFetch).then(({ accounts, subscriptions, subscriptionsFetched, trials, trialsFetched}) => {
      if (subscriptionsFetched) {
        if (subscriptions) {
          accounts.forEach(account => {
            let login = account.get('login');
            let accountSubscriptions = subscriptions.filter(
              subscription => subscription.get('owner.login') === login);

            let activeAccountSubscriptions = accountSubscriptions.filter(
              subscription => subscription.get('isSubscribed'));

            if (activeAccountSubscriptions.get('length') > 1) {
              let exception =
                new Error(`Account ${login} has more than one active subscription!`);
              this.get('raven').logException(exception, true);
            }

            let chosenSubscription = activeAccountSubscriptions.
              sortBy('validTo').get('firstObject');

            if (chosenSubscription) {
              account.set('subscription', chosenSubscription);
            } else {
              let latestSubscription = accountSubscriptions.sortBy('validTo').get('lastObject');
              account.set('subscription', latestSubscription);
            }
          });
        } else {
          accounts.setEach('subscriptionError', true);
        }
      }

      if (trialsFetched) {
        if (trials) {
          accounts.forEach(account => {
            let login = account.get('login');
            let accountTrials = trials.filter(trial => trial.get('owner.login') === login);
            let activeAccountTrials = accountTrials.filter(trial => trial.get('hasTrial'));
            let chosenTrial = activeAccountTrials.sortBy('created_at').get('firstObject');

            if (chosenTrial) {
              account.set('trial', chosenTrial);
            } else {
              let latestTrial = accountTrials.sortBy('created_at').get('lastObject');
              account.set('trial', latestTrial);
            }
          });
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

    /**
     * This preserves the user’s installation which gets somehow overwritten
     * before account/repositories gets to render. This started with #1782;
     * specifically, the createdBy: belongsTo('user') relationship on a build.
     */
    if (user.belongsTo('installation').id()) {
      controller.set('userInstallation', user.get('installation'));
    }

    return controller.set('model', model);
  },
});
