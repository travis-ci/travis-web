import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  features: service(),
  flashes: service(),
  raven: service(),
  storage: service(),
  featureFlags: service(),

  save: task(function* (state) {
    try {
      const feature = this.feature;
      // try saving with the new state, only change local state if successful
      feature.set('enabled', state);
      yield feature.save();
      this.featureFlags.applyFeatureState(feature);
    } catch (e) {
      this.raven.logException(e);
      this.flashes.error('There was an error while saving your settings. Please try again.');
    }
  }).drop(),
});
