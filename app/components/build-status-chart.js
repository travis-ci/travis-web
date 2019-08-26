import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, and, not, equal } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import {
  format as d3format,
  timeFormat as d3timeFormat
} from 'd3';
import { DEFAULT_INSIGHTS_INTERVAL } from 'travis/services/insights';

export default Component.extend({
  classNames: ['insights-odyssey'],
  classNameBindings: ['isLoading:insights-odyssey--loading', 'hasNoBuilds:insights-odyssey--empty'],
  private: false,
  interval: DEFAULT_INSIGHTS_INTERVAL,
  owner: null,

  insights: service(),

  // Chart Options
  intervalSettings: computed(function () {
    return this.insights.getIntervalSettings();
  }),

  currentIntervalLabel: computed('interval', 'intervalSettings', function () {
    return this.intervalSettings[this.interval].instanceLabel;
  }),

  // Current Interval Chart Data
  requestData: task(function* () {
    return yield this.insights.getChartData.perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_passed', 'count_failed', 'count_errored', 'count_canceled'],
      { private: this.private }
    );
  }).drop(),
  chartData: reads('requestData.lastSuccessful.value'),
  isLoading: reads('requestData.isRunning'),
  isNotLoading: not('isLoading'),

  passed: reads('chartData.data.count_passed.plotValues'),
  failed: reads('chartData.data.count_failed.plotValues'),
  errored: reads('chartData.data.count_errored.plotValues'),
  cancelled: reads('chartData.data.count_canceled.plotValues'),

  labels: reads('chartData.labels'),
  total: reads('chartData.data.total'),

  isEmpty: equal('total', 0),
  hasNoBuilds: and('isNotLoading', 'isEmpty'),

  // Chart component data
  data: computed('passed.[]', 'failed.[]', 'errored.[]', 'cancelled.[]', 'labels.[]',
    function () {
      return {
        type: 'bar',
        x: 'x',
        groups: [['Passing', 'Failing', 'Errored', 'Cancelled']],
        order: null,
        columns: [
          ['x', ...this.labels],
          ['Passing', ...this.passed],
          ['Failing', ...this.failed],
          ['Errored', ...this.errored],
          ['Cancelled', ...this.cancelled],
        ],
        colors: {
          Passing: 'rgba(57, 170, 86, 0.8)',
          Failing: 'rgba(219, 69, 69, 0.8)',
          Errored: 'rgba(237, 222, 63, 0.8)',
          Cancelled: 'rgba(157, 157, 157, 0.8)',
        },
      };
    }
  ),

  // Chart component options
  grid: computed(() => ({
    lines: { front: false },
    y: {
      show: true,
    }
  })),

  axis: computed(() => ({
    x: {
      type: 'timeseries',
      tick: { format: '%b %e' },
    },
    y: {
      tick: { format: d3format('d'), count: 6 }
    }
  })),

  tooltip: computed(() => ({
    format: {
      title: d3timeFormat('%A, %b %e'),
    }
  })),

  // Request chart data
  didReceiveAttrs() {
    this.requestData.perform();
  }
});
