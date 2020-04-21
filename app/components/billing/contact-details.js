import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  billingEmail: reads('info.billingEmail'),
  billingEmails: computed('billingEmail', function () {
    const emails = this.billingEmail || '';
    return emails.split(',');
  })
});
