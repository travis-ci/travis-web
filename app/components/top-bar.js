import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import Ember from 'ember';
import { computed, setProperties, set } from '@ember/object';
import { alias } from '@ember/object/computed';
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
  landingPage: false,

  user: alias('auth.currentUser'),

  userName: computed('user.{login,name}', function () {
    let login = this.get('user.login');
    let name = this.get('user.name');
    return name || login;
  }),

  showCta: computed('auth.signedIn', 'landingPage', 'features.landingPageCta', function () {
    let signedIn = this.get('auth.signedIn');
    let landingPage = this.get('landingPage');
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
      set(this, 'viewportTolerance.top', this.$().height());
    });
  },

  didEnterViewport() {
    this.get('flashes').set('topBarVisible', true);
  },

  didExitViewport() {
    this.get('flashes').set('topBarVisible', false);
  },
});
