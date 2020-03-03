import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  statusImages: service(),
  externalLinks: service(),
  features: service(),

  isShowingTriggerBuildModal: false,
  isShowingStatusBadgeModal: false,

  statusImageUrl: computed('repo.slug', 'repo.private', 'repo.defaultBranch.name', function () {
    const branchName = this.get('repo.defaultBranch.name');
    const repo = this.get('repo');

    return this.get('statusImages').imageUrl(repo, branchName);
  }),

  repoUrl: computed('repo.{vcsType,slug}', function () {
    const owner = this.get('item.repo.ownerName');
    const repo = this.get('item.repo.vcsName');
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
