import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service storage: null,
  @service features: null,
  @service flashes: null,
  @service raven: null,

  tagName: 'a',
  classNames: ['switch'],
  classNameBindings: ['feature.enabled:active', 'disabled:disabled', 'disabled:inline-block'],

  click() {
    this.get('toggleFeatureTask').perform(this.get('feature'));
  },

  toggleFeatureTask: task(function* (feature) {
    try {
      feature.toggleProperty('enabled');
      yield feature.save().then((feature) => {
        this.applyFeatureState(feature);
      });
    } catch (e) {
      this.get('raven').logException(e);
      const errMsg = 'There was an error while switching the feature. Please try again.';
      this.get('flashes').error(errMsg);
    }
  }),

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
