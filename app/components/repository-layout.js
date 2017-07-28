import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service statusImages: null,
  @service externalLinks: null,
  @service popup: null,

  @computed('repo.slug', 'repo.defaultBranch.name')
  statusImageUrl(slug, branchName) {
    return this.get('statusImages').imageUrl(slug, branchName);
  },

  @computed('repo.slug')
  urlGithub(slug) {
    return this.get('externalLinks').githubRepo(slug);
  },

  actions: {
    statusImages() {
      this.get('popup').open('status-images');
      return false;
    }
  },
});
