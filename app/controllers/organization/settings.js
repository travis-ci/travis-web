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

  insightsVisibilityOptions: [{
    value: 'admins',
    displayValue: 'organization owners',
    description: 'Only allow organization owners to see insights from your private builds',
  }, {
    value: 'members',
    displayValue: 'organization members',
    description: 'Only allow organization members to see insights from your private builds',
  }, {
    value: 'public',
    displayValue: 'everyone',
    description: 'Allow everyone to see insights from your private builds',
  }],

  setPrivateInsights: task(function* (val) {
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
  }).restartable(),

  actions: {
    setInsightsVis(val) {
      this.setPrivateInsights.perform(val);
    }
  },
});
