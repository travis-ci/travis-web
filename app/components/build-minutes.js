import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { DEFAULT_INSIGHTS_INTERVAL } from 'travis/services/insights';


export default Component.extend({
  classNames: ['insights-build-minutes'],
  private: false,
  interval: DEFAULT_INSIGHTS_INTERVAL,
  owner: null,

  insights: service(),

  // Current Interval Chart Data
  requestData: task(function* () {
    return yield this.insights.getChartData.perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['times_running'],
      {
        calcAvg: true,
        private: this.private,
        // Convert seconds to minutes without rounding per data point to avoid collapsing small values to 0
        customSerialize: (key, val) => [key, (val / 60)],
      }
    );
  }).drop(),
  chartData: reads('requestData.lastSuccessful.value'),
  buildMins: reads('chartData.data.times_running.plotValues'),
  labels: reads('chartData.labels'),

  isLoading: reads('requestData.isRunning'),
  isEmpty: equal('totalBuildMins', 0),
  showPlaceholder: or('isLoading', 'isEmpty'),

  // Total / average
  totalBuildMins: reads('chartData.data.times_running.total'),
  avgBuildMins: reads('chartData.data.times_running.average'),

  totalBuildText: computed('isLoading', 'totalBuildMins', function () {
    if (this.isLoading || typeof this.totalBuildMins !== 'number') { return '\xa0'; }
    // Round total to the nearest whole minute for display consistency
    const rounded = Math.round(this.totalBuildMins);
    return `
      ${rounded.toLocaleString()}
      ${pluralize(rounded, 'min', { withoutCount: true })}
    `.trim();
  }),

  // Request chart data
  didReceiveAttrs() {
    this.requestData.perform();
  }
});
