import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';

export default Component.extend({
  flashes: service(),
  stripe: service('stripev3'),
  stripeElement: null,
  stripeLoading: false,
  isLoading: or('createStripeToken.isRunning', 'isSavingSubscription'),

  createStripeToken: task(function* () {
    try {
      const { token } = yield this.stripe.createToken(this.stripeElement);
      this.handleSubmit(token.id, token.card.last4);
    } catch (error) {
      this.displayError(error);
    }
  }).drop(),

  displayError(error) {
    let message = 'There was an error connecting to stripe. Please confirm your card details and try again.';
    const stripeError = error && error.error;
    if (stripeError && stripeError.type === 'card_error') {
      message = 'Invalid card details. Please enter valid card details and try again.';
    }
    this.flashes.error(message);
  },

  options: {
    style: {
      base: {
        color: '#333',
        fontSize: '14px',
        '::placeholder': {
          color: '#666'
        },
        lineHeight: '24px'
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  },

  actions: {

    submit() {
      this.createStripeToken.perform();
    },

    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    }
  }
});
