import Ember from 'ember';

export default Ember.Service.extend({
  // this value is used to propagate branch:created events
  // to the controller and the ui
  amount: 0
});
