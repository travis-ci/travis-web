import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Component.extend({
  stripe: service(),
  flashes: service(),
  options: config.stripeOptions,
  openCreditCardForm: false,
  stripeElement: null,
  subscription: null,

  price: computed('subscription.plan.price', 'subscription.plan.annual', function () {
    let price = this.get('subscription.plan.price');
    let annual = this.get('subscription.plan.annual');
    return `$${price / 100} per ${annual ? 'year' : 'month'}`;
  }),

  monthly: not('subscription.plan.annual'),

  updateCreditCard: task(function* () {
    const { token } = yield this.stripe.createStripeToken.perform(this.stripeElement);
    try {
      if (token) {
        yield this.subscription.creditCardInfo.updateToken.perform({
          subscriptionId: this.subscription.id,
          tokenId: token.id,
          tokenCard: token.card
        });
        this.set('openCreditCardForm', false);
      }
    } catch (error) {
      this.handleError(error);
    }
  }).drop(),

  handleError(error) {
    let errorMessage = 'An error occurred when updating your credit card info. Please try again.';
    if (error && error.responseJSON) {
      errorMessage = error.responseJSON.error_message;
    }
    this.flashes.error(errorMessage);
  },

  actions: {
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
