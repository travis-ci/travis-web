import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  fetchFeatures: service(),
  featuresLoading: Ember.computed.alias('fetchFeatures.fetchTask.isRunning')
});
