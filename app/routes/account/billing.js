import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({

  stripe: service('stripe'),

  beforeModel() {
    return this.stripe.load();
  },

  getSubscription() {
    const billingInfo = this.store.createRecord('billing-info', {
      // for quick testing purposes. Clean up.
      firstName: 'Emmanuel',
      lastName: 'Patrick',
      company: 'Travis CI',
      address: '9 Olalubi street',
      address2: '24 anthony',
      city: 'Lagos',
      state: 'Lagos',
      zipCode: '43434',
      country: 'Nigeria',
      vatId: ' DE999999999',
      billingEmail: 'inem@gmail.org',
    });
    const plan = this.store.createRecord('plan');
    const creditCardInfo = this.store.createRecord('credit-card-info');
    return this.store.createRecord('subscription', {
      billingInfo,
      creditCardInfo,
      plan
    });
  },

  model() {
    return hash({
      account: this.modelFor('account'),
      plans: this.store.findAll('plan'),
      subscription: this.getSubscription()
    });
  }
});
