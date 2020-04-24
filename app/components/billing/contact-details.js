import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  multipleInput: service(),
  billingEmail: reads('info.billingEmail'),

  init() {
    this._super(...arguments);
    this.multipleInput.setProperties({
      inputString: this.billingEmail,
      label: 'Billing Email Address',
      required: 'first',
    });
  },

  billingEmails: reads('multipleInput.inputs'),

  actions: {

    handleBlur() {
      this.info.set('billingEmail', this.multipleInput.joinInputs());
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
