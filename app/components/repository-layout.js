import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  externalLinks: service(),
  features: service(),
  flashes: service(),
  router: service(),

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
    const isUser = repo.ownerType === 'user';
    const planPageUrl = isUser ? this.router.urlFor('account.plan') : this.router.urlFor('organization.plan', repo.owner);
    const settinigsPageUrl = isUser ? this.router.urlFor('account.settings') : this.router.urlFor('organization.settings', repo.owner);

    if (!repo.canOwnerBuild) {
      this.flashes.warning(`Builds have been temporarily disabled for this repository due to a negative credit balance. \
                            Please go to the <a href="${planPageUrl}">Plan page</a> to replenish your credit balance or alter your \
                            <a href="${settinigsPageUrl}">OSS Credits consumption setting</a>`);
    }
  }
});
