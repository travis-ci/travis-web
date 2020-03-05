import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  auth: service(),
  permissions: service(),
  features: service(),

  tagName: 'nav',
  classNames: ['option-button'],
  classNameBindings: ['isOpen:is-open'],
  isOpen: false,

  currentUser: reads('auth.currentUser'),
  showNewConfigView: reads('features.showNewConfigView'),

  click(e) {
    this.toggleProperty('isOpen');
  },

  mouseLeave() {
    this.set('isOpen', false);
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

  displayTriggerBuildLink: computed(
    'repo.migrationStatus',
    'repo.permissions.create_request',
    'features.{enterpriseVersion,proVersion}',
    function () {
      let migrationStatus = this.get('repo.migrationStatus');
      let canTriggerBuild = this.get('repo.permissions.create_request');
      let enterprise = this.get('features.enterpriseVersion');
      let pro = this.get('features.proVersion');

      if (enterprise || pro) {
        return canTriggerBuild;
      }
      return canTriggerBuild && migrationStatus !== 'migrated';
    }
  ),

  actions: {
    triggerBuildModal() {
      this.onTriggerBuild();
    }
  }
});
