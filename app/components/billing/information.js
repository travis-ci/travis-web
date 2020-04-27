import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { countries } from 'travis/utils/countries';

export default Component.extend({
  countries,
  multipleInput: service(),
  billingInfoEmail: reads('newSubscription.billingInfo.billingEmail'),
  billingEmails: reads('multipleInput.inputs'),
  inputString: reads('multipleInput.inputString'),

  init() {
    this._super(...arguments);
    this.multipleInput.setProperties({
      inputString: this.billingInfoEmail,
      label: 'Billing Email Address',
      required: 'first',
    });
  },

  actions: {

    handleBlur() {
      this.multipleInput.joinInputs();
      this.newSubscription.billingInfo.set('billingEmail', this.inputString);
    },

    addEmail(e) {
      e.preventDefault();
      this.multipleInput.addInput();
    },

    deleteEmail(emailLabel, e) {
      e.preventDefault();
      this.multipleInput.deleteInput(emailLabel);
    }
  }
});
