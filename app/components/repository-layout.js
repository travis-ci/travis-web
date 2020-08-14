import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  externalLinks: service(),
  features: service(),

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
  }
});
