import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service features: null,
  @service flashes: null,
  @service raven: null,
  @service storage: null,

  save: task(function* (state) {
    try {
      const feature = this.feature;
      // try saving with the new state, only change local state if successful
      feature.set('enabled', state);
      yield feature.save();
      this.applyFeatureState(feature);
    } catch (e) {
      this.raven.logException(e);
      this.flashes.error('There was an error while saving your settings. Please try again.');
    }
  }).drop(),

  _persistToLocalStorage(feature, status) {
    const featureState = JSON.parse(this.get('storage').getItem('travis.features'));
    const idx = featureState.findIndex(f => Object.keys(f)[0] === feature);
    if (idx !== -1) {
      featureState.splice(idx, 1);
    }
    featureState.pushObject({ [feature]: status });
    this.get('storage').setItem('travis.features', JSON.stringify(featureState));
  },

  applyFeatureState(feature) {
    const features = this.get('features');
    let { name, enabled } = feature.getProperties('name', 'enabled');

    enabled ? features.enable(name) : features.disable(name);
    this._persistToLocalStorage(name, enabled);
  }
});
