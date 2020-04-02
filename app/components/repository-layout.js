import Component from '@ember/component';
import { computed } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  externalLinks: service(),
  features: service(),

  isShowingTriggerBuildModal: false,
  isShowingStatusBadgeModal: false,

  isAdmin: bool('repo.permissions.admin'),

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
  }
});
