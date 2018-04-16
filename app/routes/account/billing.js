import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service raven: null,

  model() {
    let accountLogin = this.modelFor('account').get('login');

    return this.store.findAll('subscription')
      .then(subscriptions => {
        let accountSubscriptions = subscriptions.filter(
          subscription => subscription.get('owner.login') === accountLogin &&
              subscription.get('status') === 'subscribed');

        if (accountSubscriptions.get('length') > 1) {
          let exception =
            new Error(`Account ${accountLogin} has more than one active subscription!`);
          this.get('raven').logException(exception, true);
        }

        return accountSubscriptions.sortBy('validTo').get('firstObject');
      });
  },

  // FIXME without this, the same subscription was used for all user/orgs?!
  setupController(controller, model) {
    controller.set('model', model);
  }
});
