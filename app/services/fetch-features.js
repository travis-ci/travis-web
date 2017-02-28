import Ember from 'ember';
import { task } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Service.extend({
  store: service(),
  features: service(),

  /* The fetchTask is called multiple times as we traverse the route heirarchy.
   * This is because we're leveraging the beforeModel hook to avoid blocking
   * rendering.
   * To compensate for the fact that this is called multiple times, we simply
   * drop repeated attempts to fetch the feature data. Given how fast we
   * transition, this is a decent interim solution. */

  fetchTask: task(function* () {
    yield this.get('store').findAll('beta-feature').then((featureSet) => {
      let featuresService = this.get('features');
      featureSet.map((feature) => {
        // this means that non-single-word feature names will turn
        // 'comic sans' into 'comic-sans'. This may/may not work as expected.
        // TODO: Confirm that this won't break if we add a feature name with
        // spaces.
        let featureName = feature.get('dasherizedName');
        if (feature.get('enabled')) {
          featuresService.enable(featureName);
        } else {
          featuresService.disable(featureName);
        }
      });
    });
  }).drop(),
});
