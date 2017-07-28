import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import colorForState from 'travis/utils/color-for-state';

export default Ember.Component.extend({
  classNameBindings: ['color'],
  pollModels: 'build',

  @computed('build.state')
  color(buildState) {
    return colorForState(buildState);
  },
});
