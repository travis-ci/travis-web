import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNames: ['owner-tile', 'rows', 'rows--owner', 'fade-out'],
  classNameBindings: ['repo.defaultBranch.lastBuild.state'],

  isAnimating: computed('repo.defaultBranch.lastBuild.state', function () {
    let state = this.get('repo.defaultBranch.lastBuild.state');
    const animationStates = ['received', 'queued', 'started', 'booting'];
    return animationStates.includes(state);
  })
});
