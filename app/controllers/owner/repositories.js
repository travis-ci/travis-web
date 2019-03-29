import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { and, equal } from '@ember/object/computed';
import { DEFAULT_INSIGHTS_INTERVAL } from 'travis/services/insights';

export default Controller.extend({
  queryParams: ['tab', 'timeInterval'],

  features: service(),

  isLoading: false,
  page: 1,
  tab: null,
  requestPrivateInsights: true,

  timeInterval: DEFAULT_INSIGHTS_INTERVAL,
  defaultTimeInterval: DEFAULT_INSIGHTS_INTERVAL,

  isInsights: equal('tab', 'insights'),
  isPrivateInsightsViewable: and('features.proVersion', 'model.buildInfo.private'),
  includePrivateInsights: and('isPrivateInsightsViewable', 'requestPrivateInsights'),

  actions: {
    setRequestPrivateInsights(val) {
      this.set('requestPrivateInsights', val);
    },
  },
});
