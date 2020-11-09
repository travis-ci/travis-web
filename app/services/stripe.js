import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Service.extend({
  flashes: service(),
  stripev3: service('stripev3'),
  accounts: service(),

  error: null,

  load() {
    return this.stripev3.load();
  },

  createStripeToken: task(function* (stripeElement) {
    const result = yield this.stripev3.createToken(stripeElement);
    if (result && result.error) {
      this.flashErrorMessage(result.error);
    }
    return result;
  }).drop(),

  handleStripePayment: task(function* (clientSecret) {
    if (clientSecret) {
      yield this.stripev3.handleCardPayment(clientSecret);
    }
    yield this.accounts.fetchV2Subscriptions.perform();
  }).drop(),

  handleError(stripeError) {
    let errorMessage = '';
    if (stripeError) {
      const { type, message } = stripeError;
      if (type === 'card_error' || type === 'validation_error') {
        errorMessage = message;
      } else if (type === 'invalid_request_error') {
        errorMessage = 'There was a problem authorizing your card. Please retry.';
      } else {
        errorMessage = 'There was an issue processing your payment. Please try again or use a different card.';
      }
    }
    return errorMessage;
  },

  flashErrorMessage(stripeError) {
    const errorMessage = this.handleError(stripeError);
    this.flashes(errorMessage);
  }
});
