import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Component.extend({
  stripe: service(),
  flashes: service(),
  config,
  openCreditCardForm: false,
  stripeElement: null,
  subscription: null,

  price: computed('subscription.plan.price', 'subscription.plan.annual', function () {
    let price = this.get('subscription.plan.price');
    let annual = this.get('subscription.plan.annual');
    return `$${price / 100} per ${annual ? 'year' : 'month'}`;
  }),

  monthly: not('subscription.plan.annual'),

  options: {
    hidePostalCode: true,
    style: {
      base: {
        fontStyle: 'Source Sans Pro',
        fontSize: '15px',
        color: '#666',
        '::placeholder': {
          color: '#666'
        },
      },
      invalid: {
        color: 'red',
        iconColor: 'red'
      }
    }
  },
  createStripeToken: task(function* () {
    const { token } = yield this.stripe.createStripeToken.perform(this.stripeElement);
    try {
      if (token) {
        yield this.subscription.creditCardInfo.updateToken(this.subscription.id, token);
        this.set('openCreditCardForm', false);
      }
    } catch (error) {
      this.flashes.error('An error occurred when updating your credit card info. Please try again.');
    }
  }).drop(),

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
