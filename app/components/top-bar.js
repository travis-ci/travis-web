import Component from '@ember/component';
import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  @service auth: null,
  @service store: null,
  @service externalLinks: null,
  @service features: null,
  @service flashes: null,

  tagName: 'header',
  classNames: ['top'],
  landingPage: false,

  @alias('auth.currentUser') user: null,

  @computed('user.{login,name}')
  userName(login, name) {
    return name || login;
  },

  actions: {
    toggleBurgerMenu() {
      this.toggleProperty('is-open');
      return false;
    },
  },

  @computed('auth.signedIn', 'landingPage', 'features.proVersion')
  showCta(signedIn, landingPage, pro) {
    return !signedIn && !landingPage && !pro;
  },

  didInsertElement() {
    if (Ember.testing) {
      return;
    }

    Ember.setProperties(this, {
      viewportSpy: true
    });
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, () => {
      Ember.set(this, 'viewportTolerance.top', this.$().height());
    });
  },

  didEnterViewport() {
    this.get('flashes').set('topBarVisible', true);
  },

  didExitViewport() {
    this.get('flashes').set('topBarVisible', false);
  },
});
