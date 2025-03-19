import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  accounts: service(),
  flashes: service(),

  openPlansSelector: null,

  onClose() {},

  actions: {

    onConfirm() {
      this.openPlansSelector();
      this.onClose();
    },

    onClose() {
      this.onClose();
    },

    init() {
      this._super(...arguments);
    },

    preventErase(select, { keyCode, target }) {
      return keyCode !== 8 || !!target.value;
    },

    selectOptions(options) {
      this.selectOptions(options);
    }

  }

});
