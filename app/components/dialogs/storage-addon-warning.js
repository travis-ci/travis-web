import Component from '@ember/component';

export default Component.extend({
  onClose() {},
  onConfirm() {},

  actions: {

    onConfirm() {
      this.onConfirm();
    },

    onClose() {
      this.onClose();
    },

    init() {
      this._super(...arguments);
    }
  }

});
