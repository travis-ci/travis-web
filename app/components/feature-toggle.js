import Ember from 'ember';
import { task } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['switch--icon'],
  classNameBindings: ['feature.enabled:active', 'disabled:disabled', 'disabled:inline-block'],

  features: service(),

  click() {
    this.get('toggleFeatureTask').perform(this.get('feature'));
  },

  toggleFeatureTask: task(function* (feature) {
    feature.toggleProperty('enabled');
    yield feature.save().then((feature) => {
      this.applyFeatureState(feature);
    });
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
