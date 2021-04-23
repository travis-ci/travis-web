import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';

export default Component.extend({
  auth: service(),
  externalLinks: service(),
  features: service(),
  flashes: service(),
  isProVersion: reads('features.proVersion'),
  isShowingTriggerBuildModal: false,
  isShowingStatusBadgeModal: false,
  currentUser: alias('auth.currentUser'),
  userRoMode: reads('currentUser.roMode'),

  repoUrl: computed('repo.{ownerName,vcsName,vcsType}', function () {
    const owner = this.get('repo.ownerName');
    const repo = this.get('repo.vcsName');
    const vcsType = this.get('repo.vcsType');
    const vcsId = this.get('repo.vcsId');

    return this.externalLinks.repoUrl(vcsType, { owner, repo, vcsId});
  }),

  orgBuildHistoryLink: computed('repo.slug', function () {
    const slug = this.get('repo.slug');

    return this.externalLinks.orgBuildHistoryLink(slug);
  }),

  comBuildHistoryLink: computed('repo.slug', function () {
    const slug = this.get('repo.slug');

    return this.externalLinks.comBuildHistoryLink(slug);
  }),

  actions: {
    toggleStatusBadgeModal() {
      this.toggleProperty('isShowingStatusBadgeModal');
    },
    toggleTriggerBuildModal() {
      this.toggleProperty('isShowingTriggerBuildModal');
    }
  },

  didRender() {
    const repo = this.get('repo');

    if (repo.hasBuildBackups === undefined) {
      repo.fetchInitialBuildBackups.perform();
    }

    const allowance = repo.get('allowance');
    const ownerRoMode = repo.get('owner').ro_mode || false;

    if (this.isProVersion && allowance && !repo.canOwnerBuild && this.auth.currentUser && this.auth.currentUser.confirmedAt) {
      const isUser = repo.ownerType === 'user';
      if (repo.private) {
        this.flashes.custom('flashes/negative-balance-private', { owner: repo.owner, isUser: isUser }, 'warning');
      } else {
        this.flashes.custom('flashes/negative-balance-public', { owner: repo.owner, isUser: isUser }, 'warning');
      }
      if (allowance.get('pendingUserLicenses')) {
        this.flashes.custom('flashes/pending-user-licenses', { owner: repo.owner, isUser: isUser }, 'warning');
      } else if (!allowance.get('userUsage')) {
        this.flashes.custom('flashes/users-limit-exceeded', { owner: repo.owner, isUser: isUser }, 'warning');
      }
    } else if (this.userRoMode && ownerRoMode) {
      this.flashes.custom('flashes/read-only-mode', {}, 'warning');
    } else {
      this.flashes.removeCustomsByClassName('warning');
    }
  },

  willDestroyElement() {
    this.flashes.removeCustomsByClassName('warning');
  }
});
