import $ from 'jquery';
import Component from '@ember/component';
import Polling from 'travis/mixins/polling';
import colorForState from 'travis/utils/color-for-state';
import { computed } from 'ember-decorators/object';

export default Component.extend(Polling, {
  tagName: 'li',
  pollModels: 'repo',
  classNames: ['repo'],

  @computed('repo.currentBuild.state')
  color(buildState) {
    return colorForState(buildState);
  },

  scrollTop() {
    if (window.scrollY > 0) {
      return $('html, body').animate({
        scrollTop: 0
      }, 200);
    }
  }
});
