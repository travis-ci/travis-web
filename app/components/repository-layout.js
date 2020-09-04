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

    return this.externalLinks.repoUrl(vcsType, { owner, repo });
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

    if (!repo.canOwnerBuild && repo.private) {
      this.flashes.custom('flashes/negative-balance-private', { owner: repo.owner, isUser: repo.ownerType === 'user' }, 'warning');
    } else if (!repo.canOwnerBuild && !repo.private) {
      this.flashes.custom('flashes/negative-balance-public', { owner: repo.owner, isUser: repo.ownerType === 'user' }, 'warning');
    }
  },

  willDestroyElement() {
    const repo = this.get('repo');

    if (!repo.canOwnerBuild) {
      if (repo.private) {
        this.flashes.removeCustomFlashNow('flashes/negative-balance-private', { owner: this.model, isUser: this.model.isUser }, 'warning');
      } else {
        this.flashes.removeCustomFlashNow('flashes/negative-balance-public', { owner: this.model, isUser: this.model.isUser }, 'warning');
      }
    }
  }
});
