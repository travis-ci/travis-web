import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { countries } from 'travis/utils/countries';

export default Component.extend({
  countries,
  billingInfoEmail: reads('newSubscription.billingInfo.billingEmail'),
  billingEmails: computed('billingInfoEmail', function () {
    const emails = this.billingInfoEmail || '';
    return emails.split(',').map(email => ({ value: email }));
  }),

  actions: {

    handleBlur() {
      const emails = this.billingEmails.map(email => email.value);
      this.newSubscription.billingInfo.set('billingEmail', emails.join(','));
    },

    addEmail(e) {
      e.preventDefault();
      this.set('billingInfoEmail', `${this.billingInfoEmail},`);
    },
  }

});
