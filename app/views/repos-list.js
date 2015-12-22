import Ember from 'ember';
import { colorForState } from 'travis/utils/helpers';
import Polling from 'travis/mixins/polling';

export default Ember.CollectionView.extend({
  elementId: '',
  tagName: 'ul',
  emptyView: Ember.View.extend({
    templateName: 'repos-list/empty'
  }),

  itemViewClass: Ember.View.extend(Polling, {
    pollModels: 'repo',
    repoBinding: 'content',
    classNames: ['repo'],
    classNameBindings: ['color', 'selected'],

    selected: function() {
      return this.get('content') === this.get('controller.selectedRepo');
    }.property('controller.selectedRepo'),

    color: function() {
      return colorForState(this.get('repo.lastBuildState'));
    }.property('repo.lastBuildState'),

    scrollTop() {
      if (window.scrollY > 0) {
        return $('html, body').animate({
          scrollTop: 0
        }, 200);
      }
    },

    click() {
      this.scrollTop();
      return this.get('controller').transitionToRoute('/' + this.get('repo.slug'));
    }
  })
});
