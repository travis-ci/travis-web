import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { not, and } from '@ember/object/computed';

export default Component.extend({
  api: service(),

  classNames: ['settings-sshkey'],

  customKeyDeleted(key) {},

  isShowingConfirmationModal: false,
  isNotShowingConfirmationModal: not('isShowingConfirmationModal'),

  doAutofocus: false,
  focusOnModal: and('doAutofocus', 'isShowingConfirmationModal'),

  delete: task(function* () {
    try {
      yield this.api.delete(`/custom_key/${this.key.id}`);
    } catch (e) {}

    this.customKeyDeleted(this.key);
  }).drop(),

  actions: {
    confirm() {
      this.set('isShowingConfirmationModal', false);
      this.delete.perform();
    },
    toggleConfirmationModal() {
      this.toggleProperty('isShowingConfirmationModal');
      this.set('doAutofocus', true);
    },
  }
});
