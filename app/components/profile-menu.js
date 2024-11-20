import Component from '@ember/component';
import { inject as service } from '@ember/service';
import {
  equal,
  not,
  or,
  reads
} from '@ember/object/computed';
import { next } from '@ember/runloop';

export default Component.extend({
  classNames: ['profile', 'menu'],
  classNameBindings: ['auth.state', 'isMenuOpen:open'],

  auth: service(),
  multiVcs: service(),
  router: service(),
  features: service(),

  isMenuOpen: false,
  isActivation: false,

  user: reads('auth.currentUser'),

  userName: or('user.name', 'user.login'),

  get redirectUrl() {
    return window.location.href;
  },

  isSignInPage: equal('router.currentRouteName', 'signin'),
  showSignInButton: not('isSignInPage'),

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
    console.log(this.auth);
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

    signIn() {
      const { redirectUrl } = this;
      this.router.transitionTo('signin', { queryParams: { redirectUrl } });
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
