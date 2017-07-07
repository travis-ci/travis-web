import Ember from 'ember';
import Polling from "travis/src/utils/mixins/polling/mixin";

export default Ember.Component.extend(Polling, {
  pollModels: 'job'
});
