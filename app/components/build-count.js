import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { DEFAULT_INSIGHTS_INTERVAL } from 'travis/services/insights';

export default Component.extend({
  classNames: ['insights-build-count'],
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
      ['count_started'],
      {
        calcAvg: true,
        private: this.private,
      }
    );
  }).drop(),
  chartData: reads('requestData.lastSuccessful.value'),
  builds: reads('chartData.data.count_started.plotValues'),
  labels: reads('chartData.labels'),

  isLoading: reads('requestData.isRunning'),
  isEmpty: equal('totalBuilds', 0),
  showPlaceholder: or('isLoading', 'isEmpty'),

  // Total / average
  totalBuilds: reads('chartData.data.total'),
  avgBuilds: reads('chartData.data.average'),

  totalBuildText: computed('totalBuilds', function () {
    if (typeof this.totalBuilds !== 'number') { return '\xa0'; }
    return this.totalBuilds.toLocaleString();
  }),

  // Previous interval chart data
  requestPastData: task(function* () {
    return yield this.insights.getChartData.perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
      { startInterval: -2, endInterval: -1, calcTotal: true, calcAvg: true, private: this.private }
    );
  }).drop(),
  pastIntervalData: reads('requestPastData.lastSuccessful.value'),
  prevTotalBuilds: reads('pastIntervalData.data.count_started.total'),

  // Percent change
  percentChangeTitle: computed('prevTotalBuilds', 'interval', function () {
    if (this.prevTotalBuilds) {
      return [
        this.prevTotalBuilds.toLocaleString(),
        pluralize(this.prevTotalBuilds, 'build', {withoutCount: true}),
        `the previous ${this.interval}`
      ].join(' ');
    }

    return '';
  }),

  percentageChange: computed('prevTotalBuilds', 'totalBuilds', function () {
    if (this.prevTotalBuilds && this.totalBuilds) {
      const change = ((this.totalBuilds - this.prevTotalBuilds) / this.prevTotalBuilds);
      const percent = change * 100;
      return (Math.round(percent * 10) / 10);
    }

    return 0;
  }),

  percentageChangeText: computed('percentageChange', function () {
    return `${Math.abs(this.percentageChange)}%`;
  }),

  // Request chart data
  didReceiveAttrs() {
    this.requestData.perform();
    this.requestPastData.perform();
  }
});
