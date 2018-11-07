import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: 'li',
  classNames: ['owner-tile', 'rows', 'rows--owner', 'fade-out'],
  classNameBindings: ['repo.defaultBranch.lastBuild.state'],

  @computed('repo.slug')
  ownerName(slug) {
    return slug.split(/\//)[0];
  },

  @computed('repo.slug')
  repoName(slug) {
    return slug.split(/\//)[1];
  },

  @computed('repo.defaultBranch.lastBuild.state')
  isAnimating(state) {
    const animationStates = ['received', 'queued', 'started', 'booting'];
    return animationStates.includes(state);
  }
});
