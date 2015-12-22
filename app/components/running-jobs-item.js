import Ember from 'ember';
import Polling from 'travis/mixins/polling';

export default Ember.Component.extend(Polling, {
  pollModels: 'job'
});
