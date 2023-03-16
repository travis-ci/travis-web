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
  router: service(),
  storage: service(),

  tagName: 'header',
  classNames: ['top'],
  classNameBindings: ['isWhite:top--white'],
  isWhite: false,
  landingPage: false,
  isNavigationOpen: false,
  isActivation: false,

  activeModel: null,
  model: reads('activeModel'),

  user: reads('auth.currentUser'),
  isUnconfirmed: computed('user.confirmedAt', function () {
    if (!this.user || (this.storage.wizardStep > 0 && this.storage.wizardStep <= 1))
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
