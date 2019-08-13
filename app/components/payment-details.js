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
  stripe: service(),
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
    toggleEditCreditCardForm() {
      this.toggleProperty('openCreditCardForm');
    },

    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    },
  }
});
