import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

let sourceToSentence = {
  manual: 'This is a manual subscription.',
  github: 'This subscription is managed by GitHub Marketplace.',
  stripe: 'This plan is paid through Stripe.'
};

export default Component.extend({
  stripe: service('stripev3'),
  flashes: service(),
  config,
  openCreditCardForm: false,
  stripeElement: null,

  price: computed('subscription.plan.price', 'subscription.plan.annual', function () {
    let price = this.get('subscription.plan.price');
    let annual = this.get('subscription.plan.annual');
    return `$${price / 100} per ${annual ? 'year' : 'month'}`;
  }),

  source: computed('subscription.source', function () {
    let source = this.get('subscription.source');
    return `${sourceToSentence[source]}`;
  }),

  monthly: not('subscription.plan.annual'),

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

  createStripeToken: task(function* () {
    try {
      const { token } = yield this.stripe.createToken(this.stripeElement);
      this.subscription.creditCardInfo.set('token', token.id);
      this.subscription.save();
      this.set('openCreditCardForm', false);
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

  actions: {
    toggleEditCreditCardForm() {
      this.toggleProperty('openCreditCardForm');
    },
    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
