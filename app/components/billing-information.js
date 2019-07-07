import Component from '@ember/component';
import { getCountries } from '../utils/countries';
// import config from 'travis/config/environment';

export default Component.extend({
  countries: getCountries,

  actions: {
    proceedToPayment() {
      this.next();
    }
  }
});
