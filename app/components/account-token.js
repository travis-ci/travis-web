import Component from '@ember/component';
import { service } from 'ember-decorators/service';

export default Component.extend({
  classNames: ['account-token'],

  @service auth: null,

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
