import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, reads } from '@ember/object/computed';

export default Component.extend({
  auth: service(),
  permissions: service(),
  features: service(),

  tagName: '',
  isOpen: false,

  currentUser: alias('auth.currentUser'),

  close() {
    this.set('isOpen', false);
  },

  toggle() {
    this.set('isOpen', !this.isOpen);
  },

  canOwnerBuild: reads('repo.canOwnerBuild'),
  userRoMode: reads('currentUser.roMode'),

  displaySettingsLink: computed('permissions.all', 'repo', function () {
    let repo = this.repo;
    const forRepo = repo.permissions.settings_read;

    return this.permissions.hasPushPermission(repo) && forRepo;
  }),

  displayCachesLink: computed('permissions.all', 'repo', function () {
    let repo = this.repo;
    const forRepo = repo.permissions.cache_view;

    return this.permissions.hasPushPermission(repo) && config.endpoints.caches && forRepo;
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
      const forRepo = this.repo.permissions.build_create;


      if (enterprise || pro) {
        return canTriggerBuild && forRepo;
      }
      return canTriggerBuild && migrationStatus !== 'migrated' && forRepo;
    }
  ),

  actions: {
    triggerBuildModal() {
      this.onTriggerBuild();
    }
  }
});
