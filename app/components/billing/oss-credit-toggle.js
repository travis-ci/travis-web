import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  preferences: service(),

  consumeOSSCredits: reads('preferences.consumeOSSCredits'),

  toggleOSSCredits: task(function* (value) {
    try {
      yield this.preferences.set('consume_oss_credits', value, this.account.id, this.account.isOrganization);
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your OSS credit consumption settings were not saved.');
    }
  }).restartable(),

  init() {
    this._super(...arguments);
    this.preferences.fetchPreferences.perform(this.account.id, this.account.isOrganization);
  },
});
