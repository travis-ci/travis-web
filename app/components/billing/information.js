import Component from '@ember/component';
import { countries } from 'travis/utils/countries';

export default Component.extend({
  countries,

  actions: {
    updateValues(values) {
      this.newSubscription.billingInfo.set('billingEmail', values.join(','));
    },
  }
});
