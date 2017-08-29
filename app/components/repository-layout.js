import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service statusImages: null,
  @service externalLinks: null,
  @service ajax: null,

  isShowingTriggerBuildModal: false,
  isShowingStatusBadgeModal: false,

  @computed('repo.slug', 'repo.defaultBranch.name')
  statusImageUrl(slug, branchName) {
    const repo = this.get('repo');
    return this.get('statusImages').imageUrl(repo, branchName);
  },

  @computed('repo.slug')
  urlGithub(slug) {
    const repo = this.get('repo');
    return this.get('externalLinks').githubRepo(repo);
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
