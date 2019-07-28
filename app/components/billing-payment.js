import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';

export default Component.extend({
  flashes: service(),
  stripe: service('stripev3'),
  stripeElement: null,
  stripeLoading: false,
  isLoading: or('stripeLoading', 'isSavingSubscription'),

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

    async submit() {
      this.set('stripeLoading', true);
      const { token, error } = await this.stripe.createToken(this.stripeElement);
      this.set('stripeLoading', false);
      if (token && !error) {
        this.handleSubmit(token.id, token.card.last4);
      } else {
        this.flashes(error);
      }
    },

    complete(stripeElement) {
      this.set('stripeElement', stripeElement);
    }
  }
});
