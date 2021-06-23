import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';

export default Component.extend({
  permissionsService: service('permissions'),
  auth: service(),
  api: service(),
  flashes: service(),

  tagName: '',

  isLoading: false,
  isTriggering: false,
  dropupIsOpen: false,

  canOwnerBuild: reads('repo.canOwnerBuild'),
  currentUser: alias('auth.currentUser'),
  userRoMode: reads('currentUser.roMode'),
  ownerRoMode: reads('repo.owner.ro_mode'),
  currentBuild: alias('repo.currentBuild'),

  displayMenuTofu: alias('repo.permissions.create_request'),

  openDropup() {
    this.set('dropupIsOpen', true);
  },

  closeDropup() {
    this.set('dropupIsOpen', false);
  },

  triggerBuild() {
    const self = this;
    let data = {};
    data.request = `{ 'branch': '${this.get('repo.defaultBranch.name')}' }`;

    this.api.post(`/repo/${this.get('repo.id')}/requests`, { data: data })
      .then(() => {
        self.set('isTriggering', false);
        self.get('flashes')
          .success(`You’ve successfully triggered a build for ${self.get('repo.slug')}.
                   Hold tight, it might take a moment to show up.`);
      });
    this.set('dropupIsOpen', false);
    this.set('isTriggering', true);
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
