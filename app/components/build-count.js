import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { format as d3format } from 'd3';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],
  private: false,

  insights: service(),

  // Current Interval Chart Data
  requestData: task(function* () {
    return yield this.get('insights').getChartData.perform(
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
  }),
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

  // Chart component data
  data: computed('builds', 'labels', function () {
    return {
      type: 'spline',
      x: 'x',
      columns: [
        ['x', ...this.get('labels')],
        ['Builds', ...this.get('builds')],
      ],
      colors: {
        Builds: '#666',
      },
    };
  }),

  // Chart component options
  legend: { show: false },
  size: { height: 50 },

  point: {
    r: 0,
    focus: {
      expand: { r: 4 },
    }
  },

  axis: {
    x: {
      type: 'timeseries',
      tick: { format: '%Y-%m-%d' },
      show: false,
    },
    y: { show: false }
  },

  tooltip: {
    position: (data, width, height, element) => ({ top: -50, left: (width / 2) }),
    format: {
      value: d3format(','),
    }
  },

  grid: computed('avgBuilds', function () {
    return {
      lines: { front: false },
      y: {
        lines: [{
          value: this.get('avgBuilds'),
          class: 'insights-glance__centerline',
        }],
      }
    };
  }),

  // Previous interval chart data
  requestPastData: task(function* () {
    return yield this.get('insights.getChartData').perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
      { endInterval: -1, calcTotal: true, calcAvg: true, private: this.private }
    );
  }),
  pastIntervalData: reads('requestPastData.lastSuccessful.value'),
  prevTotalBuilds: reads('pastIntervalData.data.count_started.total'),

  // Percent change
  percentChangeTitle: computed('prevTotalBuilds', 'interval', function () {
    return [
      this.prevTotalBuilds.toLocaleString(),
      pluralize(this.prevTotalBuilds, 'build', {withoutCount: true}),
      `the previous ${this.interval}`
    ].join(' ');
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
    this.get('requestData').perform();
    this.get('requestPastData').perform();
  }
});
