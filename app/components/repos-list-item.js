import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import colorForState from 'travis/utils/color-for-state';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend(Polling, {
  tagName: 'li',
  pollModels: 'repo',
  classNames: ['repo'],

  @computed('repo.currentBuild.state')
  color(buildState) {
    return colorForState(buildState);
  },

  scrollTop() {
    if (window.scrollY > 0) {
      return Ember.$('html, body').animate({
        scrollTop: 0
      }, 200);
    }
  }
});
