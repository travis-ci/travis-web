import Ember from 'ember';
import computed from 'ember-computed-decorators';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['owner-tile', 'row-li'],
  classNameBindings: ['repo.default_branch.last_build.state'],

  @computed('repo.slug')
  ownerName(slug) {
    return slug.split(/\//)[0];
  },

  @computed('repo.slug')
  repoName(slug) {
    return slug.split(/\//)[1];
  },

  @computed('repo.default_branch.last_build.state')
  isAnimating(state) {
    const animationStates = ['received', 'queued', 'started', 'booting'];
    return animationStates.includes(state);
  }
});
