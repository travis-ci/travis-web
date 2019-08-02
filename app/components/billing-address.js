import Component from '@ember/component';
import { task } from 'ember-concurrency';
export default Component.extend({
  classNames: ['address'],
  openEditContactForm: false,
  openEditBillingForm: false,

  editContact: task(function* () {
    yield this.subscription.save();
    this.set('openEditContactForm', false);
    this.set('openEditBillingForm', false);
  }).drop(),

  actions: {
    toggleEditContactForm() {
      this.toggleProperty('openEditContactForm');
    },

    toggleEditBillingForm() {
      this.toggleProperty('openEditBillingForm');
    }
  }
});
