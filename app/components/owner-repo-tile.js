import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['owner-tile', 'row-li'],
  classNameBindings: ['repo.currentBuild.state'],

  ownerName: function() {
    return this.get('repo.slug').split(/\//)[0];
  }.property('repo.slug'),

  repoName: function() {
    return this.get('repo.slug').split(/\//)[1];
  }.property('repo.slug'),

  isAnimating: function() {
    var animationStates, state;
    state = this.get('repo.currentBuild.state');
    animationStates = ['received', 'queued', 'started', 'booting'];
    if (animationStates.indexOf(state) !== -1) {
      return true;
    }
  }.property('repo.currentBuild.state')
});
