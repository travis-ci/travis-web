import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  preferences: service(),
  flashes: service(),
  organization: reads('model.organization'),

  privateInsightsVisibility: reads('preferences.privateInsightsVisibility'),

  togglePublicInsights: task(function* (value) {
    try {
      yield this.preferences.set('private_insights_visibility', value);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your insights settings were not saved.');
    }
  }).restartable()
});
