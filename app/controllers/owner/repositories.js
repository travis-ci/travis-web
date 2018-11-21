import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  isLoading: false,
  page: 1,
  tab: null,
  dataInterval: 'month',

  isInsights: computed('tab', function () {
    return typeof this.tab === 'string' && this.tab.toLowerCase() === 'insights';
  }),

  actions: {
    setSubTab(selection) {
      this.set('dataInterval', selection);
    }
  },
});
