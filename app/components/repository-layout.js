import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service statusImages: null,
  @service externalLinks: null,
  @service features: null,

  isShowingTriggerBuildModal: false,
  isShowingStatusBadgeModal: false,

  @computed('repo.slug', 'repo.private', 'repo.defaultBranch.name')
  statusImageUrl(slug, repoPrivate, branchName) {
    return this.get('statusImages').imageUrl(this.get('repo'), branchName);
  },

  @computed('repo.slug')
  urlGithub(slug) {
    return this.get('externalLinks').githubRepo(slug);
  },

  @computed('repo.slug')
  orgBuildHistoryLink(slug) {
    return this.get('externalLinks').orgBuildHistoryLink(slug);
  },

  @computed('features.proVersion', 'repo.migrationStatus')
  showMigratedFromOrgRepositoryLink(onDotCom, migrationStatus) {
    console.log({onDotCom, migrationStatus});
    return onDotCom && migrationStatus === 'migrated';
  },

  actions: {
    toggleStatusBadgeModal() {
      this.toggleProperty('isShowingStatusBadgeModal');
    },
    toggleTriggerBuildModal() {
      this.toggleProperty('isShowingTriggerBuildModal');
    }
  }
});
