import Component from '@ember/component';

export default Component.extend({
  classNames: ['account-token'],

  tokenIsVisible: false,
  showCopySuccess: false,

  actions: {
    tokenVisibility() {
      if (this.showCopySuccess) {
        this.toggleProperty('showCopySuccess');
      }
      this.toggleProperty('tokenIsVisible');
    },

    copyTokenSuccessful() {
      if (!this.showCopySuccess) {
        this.toggleProperty('showCopySuccess');
      }
    },
  },
});
