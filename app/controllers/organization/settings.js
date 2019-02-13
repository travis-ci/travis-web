import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  flashes: service(),
  features: service(),
  organization: reads('model.organization'),
  preferences: computed('model.preferences.@each.{name,value}', function () {
    const list = this.model.preferences || [];
    return list.reduce((hash, record) => {
      hash[record.name] = record;
      return hash;
    }, {});
  }),
  privateInsightsVisibility: reads('preferences.private_insights_visibility.value'),
  isShowingInsightsVisibilityModal: false,

  // This is for detecting whether visibility is being increased or restricted.
  // It works because there are 3 options, any more and you'll need more complex logic.
  visibilityChange: computed(
    'preferences.private_insights_visibility.value',
    'privateInsightsVisibility',
    function () {
      const oldVis = this.preferences.private_insights_visibility.value;
      const newVis = this.privateInsightsVisibility;

      if (oldVis === newVis) {
        return 0;
      }

      if (newVis === 'admins' || oldVis === 'public') {
        return -1;
      }

      return 1;
    }
  ),

  setPrivateInsights: task(function* () {
    let val = this.get('privateInsightsVisibility');
    try {
      const record = this.preferences['private_insights_visibility'];
      record.set('value', val);
      yield record.save(
        {adapterOptions: {organization_id: this.get('organization').id}}
      ).catch((error) => {
        record.rollbackAttributes();
        throw new Error(error);
      });
      this.flashes.clear();
      this.flashes.success('Visibility of your private build insights has been updated.');
    } catch (err) {
      this.flashes.clear();
      this.flashes.error('Something went wrong and your insights settings were not saved.');
    }
    this.set('isShowingInsightsVisibilityModal', false);
  }).restartable(),

  actions: {
    toggleInsightsVisibilityModal() {
      this.toggleProperty('isShowingInsightsVisibilityModal');
    },
  }
});
