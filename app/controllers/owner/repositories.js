import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { and, equal, or } from '@ember/object/computed';
import { DEFAULT_INSIGHTS_INTERVAL } from 'travis/services/insights';

export default Controller.extend({
  queryParams: ['tab', 'timeInterval'],

  features: service(),

  isLoading: false,
  page: 1,
  tab: null,
  hasNoBuilds: false,
  requestPrivateInsights: true,

  timeInterval: null,
  defaultTimeInterval: DEFAULT_INSIGHTS_INTERVAL,
  currentTimeInterval: or('timeInterval', 'defaultTimeInterval'),

  isInsights: equal('tab', 'insights'),
  isPrivateInsightsViewable: and('features.proVersion', 'model.buildInfo.private'),
  includePrivateInsights: and('isPrivateInsightsViewable', 'requestPrivateInsights'),

  actions: {
    setRequestPrivateInsights(val) {
      this.set('requestPrivateInsights', val);
    },
  },
});
