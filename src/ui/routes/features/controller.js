import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  fetchFeatures: service('fetch-features'),
  featuresLoading: Ember.computed.alias('fetchFeatures.fetchTask.isRunning')
});
