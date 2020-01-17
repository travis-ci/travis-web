import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { and, not } from '@ember/object/computed';

export default Component.extend({
  animation: service(),
  auth: service(),
  multiVcs: service(),

  isNotSignedIn: not('auth.signedIn'),
  isOpen: false,

  showVcsOptions: and('multiVcs.enabled', 'isOpen'),

  clickMainButton() {
    if (this.multiVcs.disabled) {
      this.auth.signIn();
    }
  },
  close() {
    this.set('isOpen', false);
  },
  open() {
    this.set('isOpen', this.multiVcs.enabled);
  },
});
