import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Service.extend({
  flashes: service(),
  stripev3: service('stripev3'),

  load() {
    return this.stripev3.load();
  },

  createStripeToken: task(function* (stripeElement) {
    try {
      return yield this.stripev3.createToken(stripeElement);
    } catch (error) {
      this.displayError(error);
    }
  }).drop(),

  handleStripePayment: task(function* (clientSecret) {
    try {
      return yield this.stripev3.handleCardPayment(clientSecret);
    } catch (error) {
      this.flashes.error('Authorization failed for this payment. Please try again.');
    }
  }).drop(),

  displayError(error) {
    let message = 'There was an error updating your credit card. Please try again';
    const stripeError = error && error.error;
    if (stripeError && stripeError.type === 'card_error') {
      message = 'Invalid card details. Please enter valid card details and try again.';
    }
    this.flashes.error(message);
  },
});
