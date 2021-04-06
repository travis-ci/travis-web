import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import Ember from 'ember';
import { computed, setProperties, set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  auth: service(),
  store: service(),
  externalLinks: service(),
  features: service(),
  flashes: service(),

  tagName: 'header',
  classNames: ['top'],
  classNameBindings: ['isWhite:top--white'],
  isWhite: false,
  landingPage: false,
  isNavigationOpen: false,

  user: reads('auth.currentUser'),
  isUnconfirmed: computed('user.confirmedAt', function () {
    if (!this.user)
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
    }
  }
});
