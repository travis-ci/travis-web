import Ember from 'ember';
import { colorForState } from 'travis/utils/helpers';
import Polling from 'travis/mixins/polling';

export default Ember.Component.extend({
  classNameBindings: ['color'],
  pollModels: 'build',

  color: function() {
    return colorForState(this.get('build.state'));
  }.property('build.state')
});
