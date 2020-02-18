import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { or, reads } from '@ember/object/computed';
import { next } from '@ember/runloop';

export default Component.extend({
  classNames: ['profile', 'menu'],
  classNameBindings: ['auth.state', 'isMenuOpen:open'],

  auth: service(),
  multiVcs: service(),

  isMenuOpen: false,

  user: reads('auth.currentUser'),

  userName: or('user.name', 'user.login'),

  closeMenu() {
    if (this.isMenuOpen) {
      this.set('isMenuOpen', false);
      this.disableAutoClose();
    }
  },

  openMenu() {
    if (!this.isMenuOpen) {
      this.set('isMenuOpen', true);
      next(() => this.enableAutoClose());
    }
  },

  enableAutoClose() {
    this.clickHandler = () => {
      this.closeMenu();
    };
    document.addEventListener('click', this.clickHandler);
  },

  disableAutoClose() {
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  },

  willDestroyElement() {
    this.closeMenu();
  },

  actions: {

    signIn(provider) {
      return this.auth.signInWith(provider);
    },

    signOut() {
      return this.auth.signOut();
    },

    toggleMenu() {
      if (this.isMenuOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }

  }
});
