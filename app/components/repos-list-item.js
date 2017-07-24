import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import colorForState from 'travis/utils/color-for-state';

const { service } = Ember.inject;

export default Ember.Component.extend(Polling, {
  router: service(),
  tagName: 'li',
  pollModels: 'repo',
  classNames: ['repo'],

  color: Ember.computed('repo.currentBuild.state', function () {
    return colorForState(this.get('repo.currentBuild.state'));
  }),

  scrollTop() {
    if (window.scrollY > 0) {
      return Ember.$('html, body').animate({
        scrollTop: 0
      }, 200);
    }
  }
});
