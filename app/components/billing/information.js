import Component from '@ember/component';
import { countries } from 'travis/utils/countries';

export default Component.extend({
  countries,

  actions: {
    updateEmails(values) {
      this.billingInfo.set('billingEmail', values.join(','));
    },
  }
});
