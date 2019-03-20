import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['insights-active-repo-count'],
  private: false,

  insights: service(),

  // Chart data
  requestData: task(function* () {
    return yield this.get('insights.getChartData').perform(
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
  }),
  chartData: reads('requestData.lastSuccessful.value'),
  activeRepos: reads('chartData.data.count_started.plotValues'),
  labels: reads('chartData.labels'),

  isLoading: reads('requestData.isRunning'),
  isEmpty: equal('chartData.data.total', 0),
  showPlaceholder: or('isLoading', 'isEmpty'),

  // Average
  avgRepos: computed('chartData.data.average', function () {
    return Math.round(this.get('chartData.data.average'));
  }),

  // Active Repos has its own separate endpoint for totals, its calculation is somewhat unique
  requestActiveTotal: task(function* () {
    return yield this.get('insights').getActiveRepos(this.owner, this.interval, this.private);
  }),
  activeTotal: reads('requestActiveTotal.lastSuccessful.value.data.count'),
  activeTotalIsLoading: reads('requestActiveTotal.isRunning'),
  isAnythingLoading: or('isLoading', 'activeTotalIsLoading'),

  // Request chart data
  didReceiveAttrs() {
    this._super(...arguments);
    this.get('requestData').perform();
    this.get('requestActiveTotal').perform();
  }
});
