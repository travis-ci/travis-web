import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { or, reads } from '@ember/object/computed';

export default Component.extend({
  flashes: service(),
  stripe: service('stripev3'),
  stripeElement: null,
  stripeLoading: false,
  newSubscription: null,

  company: reads('newSubscription.billingInfo.company'),
  email: reads('newSubscription.billingInfo.billingEmail'),
  address: reads('newSubscription.billingInfo.address'),
  city: reads('newSubscription.billingInfo.city'),
  country: reads('newSubscription.billingInfo.country'),

  fullName: computed(
    'newSubscription.billingInfo.firstName',
    'newSubscription.billingInfo.lastName',
    function () {
      return `${this.newSubscription.billingInfo.firstName} ${this.newSubscription.billingInfo.lastName}`;
    }
  ),

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
    hidePostalCode: true,
    style: {
      base: {
        fontStyle: 'Source Sans Pro',
        color: '#333',
        fontSize: '15px',
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
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
