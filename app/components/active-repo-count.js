import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { DEFAULT_INSIGHTS_INTERVAL } from 'travis/services/insights';

export default Component.extend({
  classNames: ['insights-active-repo-count'],
  private: false,
  interval: DEFAULT_INSIGHTS_INTERVAL,
  owner: null,

  insights: service(),

  // Chart data
  requestData: task(function* () {
    return yield this.insights.getChartData.perform(
      this.owner,
      this.interval,
      'jobs',
      'sum',
      ['count_started'],
      {
        aggregator: 'count',
        calcAvg: true,
        private: this.private,
      }
    );
  }).drop(),
  chartData: reads('requestData.lastSuccessful.value'),
  activeRepos: reads('chartData.data.count_started.plotValues'),
  labels: reads('chartData.labels'),

  isLoading: reads('requestData.isRunning'),
  isEmpty: equal('chartData.data.total', 0),
  showPlaceholder: or('isLoading', 'isEmpty'),

  // Average
  avgRepos: reads('chartData.data.average'),
  avgReposRounded: computed('avgRepos', function () {
    return Math.round(this.avgRepos);
  }),

  // Active Repos has its own separate endpoint for totals, its calculation is somewhat unique
  requestActiveTotal: task(function* () {
    return yield this.insights.getActiveRepos(this.owner, this.interval, this.private);
  }).drop(),
  activeTotal: reads('requestActiveTotal.lastSuccessful.value.data.count'),
  activeTotalIsLoading: reads('requestActiveTotal.isRunning'),
  isAnythingLoading: or('isLoading', 'activeTotalIsLoading'),

  // Request chart data
  didReceiveAttrs() {
    this._super(...arguments);
    this.requestData.perform();
    this.requestActiveTotal.perform();
  }
});
