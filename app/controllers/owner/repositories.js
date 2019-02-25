import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { and, equal, or } from '@ember/object/computed';

export default Controller.extend({
  queryParams: ['tab', 'timeInterval'],

  features: service(),

  isLoading: false,
  page: 1,
  tab: null,
  hasNoBuilds: false,
  requestPrivateInsights: true,

  timeInterval: null,
  defaultTimeInterval: 'month',
  currentTimeInterval: or('timeInterval', 'defaultTimeInterval'),

  isInsights: equal('tab', 'insights'),
  isPrivateInsightsViewable: and('features.proVersion', 'model.buildInfo.private'),
  includePrivateInsights: and('isPrivateInsightsViewable', 'requestPrivateInsights'),

  actions: {
    setSubTab(selection) {
      this.set('timeInterval', selection);
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
