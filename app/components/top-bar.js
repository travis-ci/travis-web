import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import Ember from 'ember';
import { computed, setProperties, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';


export default Component.extend({
  auth: service(),
  store: service(),
  externalLinks: service(),
  features: service(),
  flashes: service(),
  router: service(),
  storage: service(),
  inViewport: service(),

  tagName: 'header',
  classNames: ['top'],
  classNameBindings: ['isWhite:top--white'],
  isWhite: false,
  landingPage: false,
  isNavigationOpen: false,
  isActivation: false,
  viewportTolerance: {top: 0, bottom: 0, left: 0, right: 0 },

  activeModel: null,
  model: reads('activeModel'),

  user: reads('auth.currentUser'),
  isUnconfirmed: computed('user.confirmedAt', function () {
    if (!this.user ||
        (this.storage.wizardStep > 0 && this.storage.wizardStep <= 1) ||
        this.router.currentRouteName == 'first_sync' ||
        this.router.currentRouteName == 'github_apps_installation')
      return false;
    return !this.user.confirmedAt;
  }),

  userName: computed('user.{login,name}', function () {
    let login = this.get('user.login');
    let name = this.get('user.name');
    return name || login;
  }),

  showCta: computed('auth.signedIn', 'landingPage', 'features.landingPageCta', function () {
    let signedIn = this.get('auth.signedIn');
    let landingPage = this.landingPage;
    let ctaEnabled = this.get('features.landingPageCta');

    return !signedIn && !landingPage && ctaEnabled;
  }),

  hasNoPlan: computed('model.allowance.subscriptionType', 'model.hasV2Subscription', 'model.subscription', function () {
    return !this.get('model.hasV2Subscription') && this.get('model.subscription') === undefined && this.get('model.allowance.subscriptionType') === 3;
  }),

  didInsertElement() {
    if (Ember.testing) {
      this._super(...arguments);
      return;
    }

    setProperties(this, {
      viewportSpy: true
    });
    this._super(...arguments);
    scheduleOnce('afterRender', this, () => {
      const { clientHeight = 76 } = this.element;
      set(this, 'viewportTolerance.top', clientHeight);
    });

    const topElement = this.element;
    const topElementHeight = topElement.offsetHeight;

    window.addEventListener('scroll', this.handleScroll.bind(this, topElement, topElementHeight));
  },

  willDestroyElement() {
    this._super(...arguments);
    window.removeEventListener('scroll', this.handleScroll);
  },

  handleScroll(topElement, topElementHeight) {
    if (window.scrollY > topElementHeight) {
      topElement.classList.add('fixed', 'scrolled');
    } else {
      topElement.classList.remove('fixed', 'scrolled');
    }
  },

  didEnterViewport() {
    this.flashes.set('topBarVisible', true);
  },

  didExitViewport() {
    this.flashes.set('topBarVisible', false);
  },

  actions: {
    toggleNavigation() {
      this.toggleProperty('isNavigationOpen');
    },
    setupInViewport() {
      const loader = document.getElementById('loader');
      const viewportTolerance = { bottom: 200 };
      const { onEnter, _ } = this.inViewport.watchElement(loader, { viewportTolerance });
      // pass the bound method to `onEnter` or `onExit`
      onEnter(this.didEnterViewport.bind(this));
    },

    willDestroy() {
    // need to manage cache yourself if you don't use the mixin
      const loader = document.getElementById('loader');
      this.inViewport.stopWatching(loader);

      super.willDestroy(...arguments);
    },

    didEnterViewport() {
      this.flashes.set('topBarVisible', true);
    },

    didExitViewport() {
      this.flashes.set('topBarVisible', false);
    }
  }
});
