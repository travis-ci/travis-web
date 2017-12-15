import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service statusImages: null,
  @service externalLinks: null,

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

  actions: {
    toggleStatusBadgeModal() {
      this.toggleProperty('isShowingStatusBadgeModal');
    },
    toggleTriggerBuildModal() {
      this.toggleProperty('isShowingTriggerBuildModal');
    }
  }
});
