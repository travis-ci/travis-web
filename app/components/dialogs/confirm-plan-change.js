import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, map } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  accounts: service(),
  flashes: service(),

  openPlansSelector: null,

  onClose() {},

  actions: {

    onConfirm() {
      console.log("CONFIRMPLANCHANGEINITCONFIRM");
      this.openPlansSelector();
      this.onClose();
    },

    onClose() {
      console.log("CONFIRMPLANCHANGEINITCLOSE");
      this.onClose();
    },

    init() {
      this._super(...arguments);
      console.log("CONFIRMPLANCHANGEINIT");
    },

    preventErase(select, { keyCode, target }) {
      return keyCode !== 8 || !!target.value;
    },

    selectOptions(options) {
      this.selectOptions(options);
    }

  }

});
