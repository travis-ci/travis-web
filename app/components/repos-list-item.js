import $ from 'jquery';
import Component from '@ember/component';
import Polling from 'travis/mixins/polling';
import colorForState from 'travis/utils/color-for-state';
import { computed } from '@ember/object';

export default Component.extend(Polling, {
  tagName: 'li',
  pollModels: 'repo',
  classNames: ['repo'],

  color: computed('repo.currentBuild.state', function () {
    return colorForState(this.get('repo.currentBuild.state'));
  }),

  scrollTop() {
    if (window.scrollY > 0) {
      return $('html, body').animate({
        scrollTop: 0
      }, 200);
    }
  }
});
