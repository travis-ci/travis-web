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
    let branchName = this.get('repo.defaultBranch.name');
    return this.statusImages.imageUrl(this.repo, branchName);
  }),

  urlGithub: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return this.externalLinks.githubRepo(slug);
  }),

  orgBuildHistoryLink: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return this.externalLinks.orgBuildHistoryLink(slug);
  }),

  comBuildHistoryLink: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
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
