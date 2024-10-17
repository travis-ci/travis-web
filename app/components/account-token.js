import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['account-token'],

  api: service(),
  auth: service(),

  localStorage: service('storage'),
  authStorage: reads('localStorage.auth'),

  flashes: service(),

  tokenIsVisible: false,
  showCopySuccess: false,
  showRegenerateButton: false,
  buttonClass: '',

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

    regenerateToken() {
      this.api.patch('/access_token', { data: { token: this.token  } }).then((data) => {
        this.auth.handleTokenRegeneration(data['token']);

        this.flashes.success('Token successfully regenerated!');
      }).catch(() => {
        this.flashes.error('There was an error regenerating the token.');
      });
    }
  },
});
