import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
  features: Ember.computed.alias('model'),

  actions: {
    toggleFeature(feature) {
      this.get('toggleFeatureTask').perform(feature);
    }
  },

  toggleFeatureTask: task(function* (feature) {
    feature.toggleProperty('enabled');
    feature.save();
  })
});
