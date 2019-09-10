import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Service.extend({
  flashes: service(),
  stripev3: service('stripev3'),

  load() {
    return this.stripev3.load();
  },

  createStripeToken: task(function* (stripeElement) {
    const result = yield this.stripev3.createToken(stripeElement);
    if (result && result.error) {
      this.handleError(result.error);
    }
    return result;
  }).drop(),

  handleStripePayment: task(function* (clientSecret) {
    if (clientSecret) {
      const result = yield this.stripev3.handleCardPayment(clientSecret);
      if (result && result.error) {
        this.handleError(result.error);
      }
      return result;
    }
  }).drop(),

  handleError(stripeError) {
    let errorMessage = '';
    if (stripeError) {
      const { type, message } = stripeError;
      if (type === 'card_error' || type === 'validation_error') {
        errorMessage = message;
      } else if (type === 'invalid_request_error') {
        errorMessage = 'Invalid card details. Please try again';
      } else {
        errorMessage = 'An error occurred connecting to Stripe. Please try again';
      }
    }
    this.flashes.error(errorMessage);
  },
});
