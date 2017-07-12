import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  featureFlags: service(),
  featuresLoading: Ember.computed.alias('featureFlags.fetchTask.isRunning')
});
