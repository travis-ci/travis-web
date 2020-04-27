import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  multipleInput: service(),

  inputsString: reads('multipleInput.inputsString'),
  billingEmails: reads('multipleInput.inputs'),
  billingEmail: reads('info.billingEmail'),

  init() {
    this._super(...arguments);
    this.multipleInput.setProperties({
      inputsString: this.billingEmail,
      label: 'Billing Email Address',
      required: 'first',
    });
  },


  actions: {

    handleBlur() {
      this.multipleInput.joinInputs();
      this.info.set('billingEmail', this.inputsString);
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
