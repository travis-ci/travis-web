import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  permissionsService: service('permissions'),
  api: service(),
  flashes: service(),

  tagName: '',

  isLoading: false,
  dropupIsOpen: false,

  currentBuild: alias('repo.currentBuild'),

  displayMenuTofu: alias('repo.permissions.create_request'),

  openDropup() {
    this.set('dropupIsOpen', true);
  },

  closeDropup() {
    this.set('dropupIsOpen', false);
  },

  actions: {
    openDropup() {
      this.openDropup();
    },

    triggerBuild() {
      this.triggerBuild();
    },

    starRepo() {
      if (this.get('repo.starred')) {
        this.unstar.perform(this.repo);
      } else {
        this.star.perform(this.repo);
      }
    }
  }
});
