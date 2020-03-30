import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { reads, equal, not, and } from '@ember/object/computed';
import {
  DEFAULT_INSIGHTS_INTERVAL,
  INSIGHTS_INTERVALS
} from 'travis/services/insights';

export default Component.extend({
  classNames: ['insights-overlay'],
  classNameBindings: [
    'isLoading:insights-overlay--loading',
    'showOverlay:insights-overlay--active',
  ],

  auth: service(),
  insights: service(),

  owner: null,
  private: false,
  interval: DEFAULT_INSIGHTS_INTERVAL,

  // Current Interval Build Data
  requestData: task(function* () {
    return yield this.insights.getChartData.perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
      {
        calcTotal: true,
        private: this.private,
      }
    );
  }),

  buildData: reads('requestData.lastSuccessful.value'),
  isLoading: reads('requestData.isRunning'),
  isNotLoading: not('isLoading'),
  totalBuilds: reads('buildData.data.count_started.total'),
  hasNoBuilds: equal('totalBuilds', 0),
  showOverlay: and('isNotLoading', 'hasNoBuilds'),
  canSync: and('auth.signedIn', 'owner.permissions.sync'),

  isMonth: equal('interval', INSIGHTS_INTERVALS.MONTH),
  isWeek: equal('interval', INSIGHTS_INTERVALS.WEEK),

  actions: {
    signIn() {
      return this.auth.signIn();
    },
  },

  // Request build data
  didReceiveAttrs() {
    this.requestData.perform();
  }
});
