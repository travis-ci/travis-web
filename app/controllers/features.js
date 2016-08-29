import Ember from 'ember';

export default Ember.Controller.extend({
  features: Ember.computed.alias('model')
});
