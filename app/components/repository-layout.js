import Ember from 'ember';
import computed from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Component.extend({
  statusImages: service(),
  popup: service(),

  @computed('repo.slug', 'repo.defaultBranch.name')
  statusImageUrl(slug, branchName) {
    return this.get('statusImages').imageUrl(slug, branchName);
  },

  actions: {
    statusImages() {
      this.get('popup').open('status-images');
      return false;
    }
  },
});
