import Ember from 'ember';
import { colorForState } from 'travis/utils/helpers';

export default Ember.Component.extend({
  classNameBindings: ['color'],
  pollModels: 'build',

  color: function () {
    return colorForState(this.get('build.state'));
  }.property('build.state')
});
