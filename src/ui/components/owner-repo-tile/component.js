import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['owner-tile', 'row-li'],
  classNameBindings: ['repo.default_branch.last_build.state'],

  ownerName: Ember.computed('repo.slug', function () {
    return this.get('repo.slug').split(/\//)[0];
  }),

  repoName: Ember.computed('repo.slug', function () {
    return this.get('repo.slug').split(/\//)[1];
  }),

  isAnimating: Ember.computed('repo.default_branch.last_build.state', function () {
    let animationStates, state;
    state = this.get('repo.default_branch.last_build.state');
    animationStates = ['received', 'queued', 'started', 'booting'];
    if (animationStates.indexOf(state) !== -1) {
      return true;
    }
  })
});
