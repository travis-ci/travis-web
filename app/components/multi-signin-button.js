import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { and, not } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  animation: service(),
  auth: service(),
  multiVcs: service(),
  router: service(),

  isLinkToSignin: false,
  isOpen: false,

  isNotLinkToSignin: not('isLinkToSignin'),
  isNotSignedIn: not('auth.signedIn'),
  isOpenable: and('isNotLinkToSignin', 'multiVcs.enabled'),

  showVcsOptions: and('isOpenable', 'isOpen'),

  clickMainButton() {
    if (this.isLinkToSignin) {
      this.router.transitionTo('signin');
    } else if (this.multiVcs.disabled) {
      this.auth.signIn();
    }
  },
  close() {
    this.set('isOpen', false);
  },
  open() {
    this.set('isOpen', this.isOpenable);
  },
  signInWith(provider) {
    this.auth.signInWith(provider);
  },
});
