import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { pluralize } from 'ember-inflector';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['insights-queue-times'],
  private: false,

  insights: service(),

  // Current Interval Chart Data
  requestData: task(function* () {
    return yield this.insights.getChartData.perform(
      this.owner,
      this.interval,
      'jobs',
      'avg',
      ['times_waiting'],
      {
        calcAvg: true,
        private: this.private,
        // Convert seconds to minutes without rounding per point; show rounding only in text
        customSerialize: (key, val) => [key, (val / 60)],
      }
    );
  }).drop(),
  chartData: reads('requestData.lastSuccessful.value'),
  waitMins: reads('chartData.data.times_waiting.plotValues'),
  labels: reads('chartData.labels'),

  isLoading: reads('requestData.isRunning'),
  isEmpty: equal('totalWaitMins', 0),
  showPlaceholder: or('isLoading', 'isEmpty'),

  // Total / average
  totalWaitMins: reads('chartData.data.times_waiting.total'),
  average: reads('chartData.data.times_waiting.average'),
  averageRounded: computed('average', function () {
    return Math.round(this.average * 100) / 100;
  }),

  avgWaitText: computed('isLoading', 'averageRounded', function () {
    const { isLoading, averageRounded } = this;

    if (isLoading || typeof averageRounded !== 'number') { return '\xa0'; }

    return `
      ${averageRounded.toLocaleString()}
      ${pluralize(averageRounded, 'min', {withoutCount: true})}
    `.trim();
  }),

  // Previous interval chart data
  requestPastData: task(function* () {
    return yield this.insights.getChartData.perform(
      this.owner,
      this.interval,
      'jobs',
      'avg',
      ['times_waiting'],
      {
        startInterval: -2,
        endInterval: -1,
        calcAvg: true,
        private: this.private,
        customSerialize: (key, val) => [key, Math.round(val / 60)]
      }
    );
  }).drop(),
  pastIntervalData: reads('requestPastData.lastSuccessful.value'),

  previousAverage: reads('pastIntervalData.data.times_waiting.average'),
  previousAverageRounded: computed('previousAverage', function () {
    return Math.round(this.previousAverage * 100) / 100;
  }),

  // Percent change
  percentageChange: computed('previousAverageRounded', 'averageRounded', function () {
    const { previousAverageRounded, averageRounded } = this;

    if (previousAverageRounded && averageRounded) {
      const change = ((averageRounded - previousAverageRounded) / previousAverageRounded);
      const percent = change * 100;
      return (Math.round(percent * 10) / 10);
    }

    return 0;
  }),

  percentageChangeText: computed('percentageChange', function () {
    return `${Math.abs(this.percentageChange)}%`;
  }),

  percentChangeTitle: computed('previousAverageRounded', 'interval', function () {
    const { previousAverageRounded, interval } = this;

    return [
      'Averaged',
      previousAverageRounded.toLocaleString(),
      pluralize(previousAverageRounded, 'min', { withoutCount: true }),
      `the previous ${interval}`
    ].join(' ');
  }),

  // Request chart data
  didReceiveAttrs() {
    this.requestData.perform();
    this.requestPastData.perform();
  }
});
