import { colorForState } from 'travis/utils/helpers';
import BasicView from 'travis/views/basic';
import Polling from 'travis/mixins/polling';

export default BasicView.extend(Polling, {
  classNameBindings: ['color'],
  buildBinding: 'controller.build',
  pollModels: 'controller.build',

  color: function() {
    return colorForState(this.get('build.state'));
  }.property('build.state')
});
