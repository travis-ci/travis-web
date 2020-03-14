import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, reads } from '@ember/object/computed';
import CanTriggerBuild from 'travis/mixins/components/can-trigger-build';

export default Component.extend(CanTriggerBuild, {
  auth: service(),
  permissions: service(),
  features: service(),

  tagName: '',
  isOpen: false,
  showNewConfigView: reads('features.showNewConfigView'),

  currentUser: alias('auth.currentUser'),

  close() {
    this.set('isOpen', false);
  },

  toggle() {
    this.set('isOpen', !this.isOpen);
  },

  displaySettingsLink: computed('permissions.all', 'repo', function () {
    let repo = this.repo;
    return this.permissions.hasPushPermission(repo);
  }),

  displayCachesLink: computed('permissions.all', 'repo', function () {
    let repo = this.repo;
    return this.permissions.hasPushPermission(repo) && config.endpoints.caches;
  }),

  displayStatusImages: computed('permissions.all', 'repo', function () {
    let repo = this.repo;
    return this.permissions.hasPermission(repo);
  }),

  actions: {
    triggerBuildModal() {
      this.onTriggerBuild();
    }
  }
});
