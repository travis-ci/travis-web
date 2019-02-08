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
  requestPrivate: true,

  isInsights: computed('tab', function () {
    return typeof this.tab === 'string' && this.tab.toLowerCase() === 'insights';
  }),

  isPrivateInsightsViewable: computed(function () {
    let pro = this.get('features.proVersion');
    let privateResponse = this.get('model.buildInfo.private') === true;
    return pro && privateResponse;
  }),

  includePrivate: computed('isPrivateInsightsViewable', 'requestPrivate', function () {
    return this.isPrivateInsightsViewable && this.requestPrivate;
  }),

  actions: {
    setSubTab(selection) {
      this.set('dataInterval', selection);
      this.set('hasNoBuilds', false);
    },
    setNoBuilds(val) {
      this.set('hasNoBuilds', val);
    }
  },
});
