import $ from 'jquery';
import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';

export default Route.extend({
  @service auth: null,
  @service tabStates: null,
  @service repositories: null,
  @service features: null,

  redirect() {
    if (this.get('auth.signedIn')) {
      if (this.get('features.dashboard')) {
        this.transitionTo('dashboard');
      }
    } else if (this.get('features.enterpriseVersion')) {
      this.transitionTo('auth');
    }
  },

  renderTemplate(...args) {
    if (this.get('auth.signedIn')) {
      $('body').attr('id', 'home');
    }
    return this._super(args);
  },

  activate(...args) {
    this._super(args);
    if (this.get('auth.signedIn')) {
      this.get('tabStates').set('sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'current');
    }
  },

  deactivate() {
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    this.stopObservingRepoStatus();
    return this._super(...arguments);
  },

  stopObservingRepoStatus() {
    let controller = this.controllerFor('repo');
    controller.removeObserver('repo.active', this, 'renderTemplate');
    controller.removeObserver('repo.currentBuildId', this, 'renderTemplate');
  },

  actions: {
    redirectToGettingStarted() {
      return this.transitionTo('getting_started');
    },
  },
});
