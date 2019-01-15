import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['account-token'],

  auth: service(),

  tokenIsVisible: false,
  showCopySuccess: false,

  actions: {
    tokenVisibility() {
      if (this.get('showCopySuccess')) {
        this.toggleProperty('showCopySuccess');
      }
      this.toggleProperty('tokenIsVisible');
    },

    copyTokenSuccessful() {
      if (!this.get('showCopySuccess')) {
        this.toggleProperty('showCopySuccess');
      }
    },
  },
});
