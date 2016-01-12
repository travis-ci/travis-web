import Polling from 'travis/mixins/polling';
import Ember from 'ember';

export default Ember.Component.extend(Polling, {
  pollModels: 'repo',
  classNameBindings: ['isLoading:loading']
});
