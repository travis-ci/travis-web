import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  preferences: service(),
  flashes: service(),
  organization: reads('model.organization'),

  publicInsights: reads('preferences.publicInsights'),
  membersInsights: reads('preferences.hash.members_insights.value'),

  togglePublicInsights: task(function* (value) {
    try {
      yield this.preferences.set('public_insights', value);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your insights settings were not saved.');
    }
  }).restartable()
});
