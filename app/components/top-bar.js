import Component from '@ember/component';
// import Ember from 'ember';
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

  @computed('auth.signedIn', 'landingPage', 'features.landingPageCta')
  showCta(signedIn, landingPage, ctaEnabled) {
    return !signedIn && !landingPage && ctaEnabled;
  },

  // FIXME restore ember-in-viewport use
});
