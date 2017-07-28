import Ember from 'ember';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service features: null,
  @service flashes: null,

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
      const errMsg = 'There was an error while switching the feature. Please try again.';
      this.get('flashes').error(errMsg);
    }
  }),

  applyFeatureState(feature) {
    let { name, enabled } = feature.getProperties('name', 'enabled');
    if (enabled) {
      this.get('features').enable(name);
    } else {
      this.get('features').disable(name);
    }
  }
});
