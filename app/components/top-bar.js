import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import Ember from 'ember';
import { computed, setProperties, set, action } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class TopBar extends Component {
  @service auth;
  @service store;
  @service externalLinks;
  @service features;
  @service flashes;
  @service router;
  @service storage;
  @service inViewport

  tagName = 'header';
  classNames = ['top'];
  classNameBindings = ['isWhite:top--white'];
  isWhite = false;
  landingPage = false;
  isNavigationOpen = false;
  isActivation = false;

  activeModel = null;
  @reads('activeModel') model;

  @reads('auth.currentUser') user;

  @computed('user.confirmedAt')
  get isUnconfirmed() {
    if (!this.user ||
      (this.storage.wizardStep > 0 && this.storage.wizardStep <= 1) ||
      this.router.currentRouteName == 'first_sync' ||
      this.router.currentRouteName == 'github_apps_installation') {
      return false;
    }
    return !this.user.confirmedAt;
  }

  @computed('user.{login,name}')
  get userName() {
    let login = this.user.login;
    let name = this.user.name;
    return name || login;
  }

  @computed('auth.signedIn', 'landingPage', 'features.landingPageCta')
  get showCta() {
    let signedIn = this.auth.signedIn;
    let landingPage = this.landingPage;
    let ctaEnabled = this.features.landingPageCta;

    return !signedIn && !landingPage && ctaEnabled;
  }

  @computed('model.allowance.subscriptionType', 'model.hasV2Subscription', 'model.subscription')
  get hasNoPlan() {
    if(!this.model) return false; // logged out
    return !this.model.hasV2Subscription && this.model.subscription === undefined && this.model.allowance.subscriptionType === 3;
  }

  @action
  setupInViewport() {
    const loader = document.getElementById('loader');
    const viewportTolerance = { bottom: 200 };
    const { onEnter, _onExit } = this.inViewport.watchElement(loader, { viewportTolerance });
    // pass the bound method to `onEnter` or `onExit`
    onEnter(this.didEnterViewport.bind(this));
  }

  willDestroy() {
    // need to manage cache yourself if you don't use the mixin
    const loader = document.getElementById('loader');
    this.inViewport.stopWatching(loader);

    super.willDestroy(...arguments);
  }

  didInsertElement() {
    if (Ember.testing) {
      super.didInsertElement(...arguments);
      return;
    }

    set(this, 'viewportSpy', true);
    super.didInsertElement(...arguments);
    scheduleOnce('afterRender', this, () => {
      const { clientHeight = 76 } = this.element;
      set(this, 'viewportTolerance.top', clientHeight);
    });
  }

  didEnterViewport() {
    this.flashes.set('topBarVisible', true);
  }

  didExitViewport() {
    this.flashes.set('topBarVisible', false);
  }

  @action
  toggleNavigation() {
    this.toggleProperty('isNavigationOpen');
  }
}
