import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  billingEmail: reads('info.billingEmail'),
  billingEmails: computed('billingEmail', {
    get() {
      const emails = this.billingEmail || '';
      return emails.split(',').map((email, index) => ({
        label: `Billing Email Address ${index + 1}`,
        value: email,
        required: index === 0
      }));
    },
    set(_, value) {
      return value;
    }
  }),

  actions: {

    handleBlur() {
      const emails = this.billingEmails.map(email => email.value);
      this.info.set('billingEmail', emails.join(','));
    },

    addEmail(e) {
      e.preventDefault();
      const nextEmailNumber = this.billingEmails.length + 1;
      this.set('billingEmails', [
        ...this.billingEmails,
        { label: `Billing Email Address ${nextEmailNumber}`, value: '', required: false }
      ]);
    },

    deleteEmail(emailLabel, e) {
      e.preventDefault();
      const remainingEmails = this.billingEmails.filter(email => email.label !== emailLabel);
      this.set('billingEmails', remainingEmails);
    }
  }
});
