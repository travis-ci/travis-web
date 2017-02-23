import Ember from 'ember';
import { task } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['switch'],
  classNameBindings: ['feature.enabled:active', 'disabled:disabled', 'disabled:inline-block'],

  features: service(),
  flashes: service(),

  click() {
    this.get('toggleFeatureTask').perform(this.get('feature'));
  },

  toggleFeatureTask: task(function* (feature) {
    try {
      yield feature.save().then((feature) => {
        feature.toggleProperty('enabled');
        this.applyFeatureState(feature);
      });
    } catch (e) {
      // eslint-disable-next-line
      this.get('flashes').error('There was an error while switching the feature. Please try again.');
    }
  }),

  applyFeatureState(feature) {
    // let { dasherizedName, enabled } = feature.getProperties('name', 'enabled');
    let { name, enabled } = feature.getProperties('name', 'enabled');
    if (enabled) {
      this.get('features').enable(name);
    } else {
      this.get('features').disable(name);
    }
  }
});
