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
    return this.get('statusImages').imageUrl(this.get('repo'), branchName);
  }),

  urlGithub: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return this.get('externalLinks').githubRepo(slug);
  }),

  orgBuildHistoryLink: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return this.get('externalLinks').orgBuildHistoryLink(slug);
  }),

  comBuildHistoryLink: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return this.get('externalLinks').comBuildHistoryLink(slug);
  }),

  showMigratedToComRepositoryLink: computed(
    'features.{proVersion,enterpriseVersion}',
    'repo.migrationStatus',
    function () {
      let pro = this.get('features.proVersion');
      let enterprise = this.get('features.enterpriseVersion');
      let migrationStatus = this.get('repo.migrationStatus');
      const orgHosted = !pro && !enterprise;
      return orgHosted && migrationStatus === 'migrated';
    }
  ),

  actions: {
    toggleStatusBadgeModal() {
      this.toggleProperty('isShowingStatusBadgeModal');
    },
    toggleTriggerBuildModal() {
      this.toggleProperty('isShowingTriggerBuildModal');
    }
  }
});
