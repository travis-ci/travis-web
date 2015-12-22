import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import { colorForState } from 'travis/utils/helpers';

export default Ember.Component.extend(Polling, {
  routing: Ember.inject.service('-routing'),
  tagName: 'li',
  pollModels: 'repo',
  classNames: ['repo'],
  classNameBindings: ['selected'],

  selected: function() {
    return this.get('repo') === this.get('selectedRepo');
  }.property('selectedRepo'),

  color: function() {
    return colorForState(this.get('repo.lastBuildState'));
  }.property('repo.lastBuildState'),

  scrollTop: function() {
    if (window.scrollY > 0) {
      return $('html, body').animate({
        scrollTop: 0
      }, 200);
    }
  },

  click() {
    this.scrollTop();
    return this.get('routing').transitionTo('repo', this.get('repo.slug').split('/'));
  }
});
