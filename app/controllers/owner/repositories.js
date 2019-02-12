import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  isLoading: false,
  page: 1,
  tab: null,
  dataInterval: 'month',
  hasNoBuilds: false,
  features: service(),
  requestPrivateInsights: true,

  isInsights: computed('tab', function () {
    return typeof this.tab === 'string' && this.tab.toLowerCase() === 'insights';
  }),

  isPrivateInsightsViewable: computed(function () {
    let pro = this.get('features.proVersion');
    let privateResponse = this.get('model.buildInfo.private') === true;
    return pro && privateResponse;
  }),

  includePrivateInsights: computed(
    'isPrivateInsightsViewable',
    'requestPrivateInsights',
    function () {
      return this.isPrivateInsightsViewable && this.requestPrivateInsights;
    }
  ),

  actions: {
    setSubTab(selection) {
      this.set('dataInterval', selection);
      this.set('hasNoBuilds', false);
    },
    setNoBuilds(val) {
      this.set('hasNoBuilds', val);
    },
    setRequestPrivateInsights(val) {
      this.set('requestPrivateInsights', val);
    },
  },
});
