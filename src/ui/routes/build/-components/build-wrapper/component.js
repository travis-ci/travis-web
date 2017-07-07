import Ember from 'ember';
import colorForState from "travis/src/utils/color-for-state";

export default Ember.Component.extend({
  classNameBindings: ['color'],
  pollModels: 'build',

  color: Ember.computed('build.state', function () {
    return colorForState(this.get('build.state'));
  })
});
