import Component from '@ember/component';
import { countries } from '../../utils/countries';
import { equal }  from '@ember/object/computed';

const SCROLL = {
  CONTACT: 'contactDetails',
  BILLING: 'billingDetails',
};

export default Component.extend({
  countries,
  scrollSection: null,

  scrollToContactDetails: equal('scrollSection', SCROLL.CONTACT),
  scrollToBillingDetails: equal('scrollSection', SCROLL.BILLING)
});
