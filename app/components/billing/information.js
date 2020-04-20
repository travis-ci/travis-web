import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { countries } from 'travis/utils/countries';

export default Component.extend({
  countries,
  billingInfoEmail: reads('newSubscription.billingInfo.billingEmail'),
  billingEmails: computed('billingInfoEmail', {
    get() {
      const emails = this.billingInfoEmail || '';
      return emails.split(',').map((email, index) =>
        ({ label: `Billing Email Address ${index + 1}`, value: email })
      );
    },
    set(_, value) {
      return value;
    }
  }),

  actions: {

    handleBlur() {
      const emails = this.billingEmails.map(email => email.value);
      this.newSubscription.billingInfo.set('billingEmail', emails.join(','));
    },

    addEmail(e) {
      e.preventDefault();
      const nextEmailNumber = this.billingEmails.length + 1;
      this.set('billingEmails', [
        ...this.billingEmails,
        { label: `Billing Email Address ${nextEmailNumber}`, value: '' }
      ]);
    },
  }

});
