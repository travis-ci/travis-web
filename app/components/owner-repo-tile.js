import Ember from 'ember';

const { alias } = Ember.computed;

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['owner-tile', 'row-li'],
  classNameBindings: ['currentBuild.state'],

  currentBuild: alias('repo.default_branch.last_build'),

  ownerName: function() {
    return this.get('repo.slug').split(/\//)[0];
  }.property('repo.slug'),

  repoName: function() {
    return this.get('repo.slug').split(/\//)[1];
  }.property('repo.slug'),

  isAnimating: function() {
    var animationStates, state;
    state = this.get('currentBuild.state');
    animationStates = ['received', 'queued', 'started', 'booting'];
    if (animationStates.indexOf(state) !== -1) {
      return true;
    }
  }.property('currentBuild.state')
});
