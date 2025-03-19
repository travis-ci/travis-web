import Controller from '@ember/controller';
import { reads, and, equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export const INSIGHTS_VIS_OPTIONS = [
  {
    key: 'admins',
    displayValue: 'organization owners',
    description: 'Only allow organization owners to see insights from your private builds',
  }, {
    key: 'members',
    displayValue: 'organization members',
    description: 'Only allow organization members to see insights from your private builds',
  }, {
    key: 'public',
    displayValue: 'everyone',
    description: 'Allow everyone to see insights from your private builds',
  }
];

export const SECTION = {
  NONE: '',
  INSIGHTS: 'insights',
};

export default Controller.extend({
  flashes: service(),
  features: service(),

  queryParams: ['section'],
  section: SECTION.NONE,
  scrollToInsights: equal('section', SECTION.INSIGHTS),

  organization: reads('model.organization'),

  customKeys: computed('model.organization.customKeys.[]', function () {
    return this.model.organization.customKeys;
  }),

  envVarsLoaded: computed('organization.accountEnvVars', function () {
    return this.organization.accountEnvVars;
  }),
  envVars: computed('envVarsLoaded.[]', function () {
    return (this.envVarsLoaded || []).sortBy('name');
  }),

  preferences: computed('model.preferences.@each.{name,value}', function () {
    const list = this.model.preferences || [];
    return list.reduce((hash, record) => {
      hash[record.name] = record;
      return hash;
    }, {});
  }),
  privateInsightsVisibility: reads('preferences.private_insights_visibility.value'),
  showOrganizationSettings: and('features.proVersion', 'organization.permissions.settings_create'),

  insightsVisibilityOptions: computed(() => INSIGHTS_VIS_OPTIONS),

  setPrivateInsights: task(function* (val) {
    try {
      const record = this.preferences['private_insights_visibility'];
      record.set('value', val);
      yield record.save(
        {adapterOptions: {organization_id: this.organization.id}}
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

  isShowingAddKeyModal: false,

  actions: {
    setInsightsVis(val) {
      this.setPrivateInsights.perform(val);
    },

    toggleAddKeyModal() {
      this.toggleProperty('isShowingAddKeyModal');
    },

    customKeyDeleted(key) {
      const keys = this.get('customKeys');
      this.set('model.organization.customKeys', keys.filter(obj => obj.id !== key.id));
    },

    customKeyAdded(key) {
      this.get('model.organization.customKeys').pushObject(key);
    },

    envVarDeleted(envVar) {
      const envVars = this.organization.accountEnvVars;
      envVars.removeObject(envVar);
    },

    envVarAdded(envVar) {
      const envVars = this.organization.accountEnvVars;
      envVars.pushObject(envVar);
    }
  },
});
