import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  stripe: service(),

  beforeModel() {
    return this.stripe.load();
  },

  newSubscription() {
    const billingInfo = this.store.createRecord('billing-info', {
      // for quick testing purposes. Clean up.
      firstName: 'Emmanuel',
      lastName: 'Patrick',
      company: 'Travis CI',
      address: '9 Olalubi street',
      city: 'Lagos',
      state: 'Lagos',
      zipCode: '43434',
      country: 'Nigeria',
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
      newSubscription: this.newSubscription()
    });
  }
});
