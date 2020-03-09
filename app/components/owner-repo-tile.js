import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNames: ['owner-tile', 'rows', 'rows--owner', 'fade-out'],
  classNameBindings: ['repo.defaultBranch.lastBuild.state'],

  ownerName: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return slug.split(/\//)[0];
  }),

  repoName: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return slug.split(/\//)[1];
  }),

  isAnimating: computed('repo.defaultBranch.lastBuild.state', function () {
    let state = this.get('repo.defaultBranch.lastBuild.state');
    const animationStates = ['received', 'queued', 'started', 'booting'];
    return animationStates.includes(state);
  })
});
