import Ember from 'ember';
import { computed } from 'ember-decorators/object';

const { service } = Ember.inject;

export default Ember.Component.extend({
  statusImages: service(),
  externalLinks: service(),
  popup: service(),

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
