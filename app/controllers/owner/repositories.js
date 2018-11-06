import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  isLoading: false,
  page: 1,
  tab: null,
  dataInterval: 'month',
  insightToken: '',

  @computed('tab')
  isInsights(tab) {
    return typeof tab === 'string' && tab.toLowerCase() === 'insights';
  },

  actions: {
    setSubTab(selection) {
      this.set('dataInterval', selection);
    }
  },
});
