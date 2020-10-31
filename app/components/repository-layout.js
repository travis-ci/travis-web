import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  externalLinks: service(),
  features: service(),
  flashes: service(),

  isShowingTriggerBuildModal: false,
  isShowingStatusBadgeModal: false,

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

    if (!repo.canOwnerBuild) {
      const isUser = repo.ownerType === 'user';
      const allowance = repo.get('allowance');

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
    } else {
      this.flashes.removeCustomsByClassName('warning');
    }
  },

  willDestroyElement() {
    this.flashes.removeCustomsByClassName('warning');
  }
});
