import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @service features: null,
  @service flashes: null,
  @service raven: null,
  @service storage: null,

  tagName: 'button',
  classNames: ['switch'],
  classNameBindings: ['feature.enabled:active', 'disabled:disabled', 'disabled:inline-block'],
  attributeBindings: ['aria-checked', 'role'],
  role: 'switch',

  @computed('active')
  'aria-checked'(active) {
    active ? 'true' : 'false';
  },

  save: task(function* (feature) {
    try {
      // try saving with the new state, only change local state if successful
      feature.toggleProperty('enabled');
      yield feature.save().then((feature) => {
        this.applyFeatureState(feature);
      });
    } catch (e) {
      this.get('raven').logException(e);
      this.get('flashes').error('There was an error while saving your settings. Please try again.');
    }
  }).drop(),

  click() {
    this.get('save').perform(this.get('feature'));
  },

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
