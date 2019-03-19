import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
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
    return yield this.get('insights.getChartData').perform(
      this.owner,
      this.interval,
      'jobs',
      'avg',
      ['times_waiting'],
      {
        calcAvg: true,
        private: this.private,
        customSerialize: (key, val) => [key, (Math.round((val / 60) * 100) / 100)],
      }
    );
  }),
  chartData: reads('requestData.lastSuccessful.value'),
  waitMins: reads('chartData.data.times_waiting.plotValues'),
  labels: reads('chartData.labels'),

  isLoading: reads('requestData.isRunning'),
  isEmpty: equal('totalWaitMins', 0),
  showPlaceholder: or('isLoading', 'isEmpty'),

  // Total / average
  totalWaitMins: reads('chartData.data.times_waiting.total'),
  avgWaitMins: computed('chartData.data.times_waiting.average', function () {
    return Math.round(this.get('chartData.data.times_waiting.average') * 100) / 100;
  }),

  avgWaitText: computed('isLoading', 'avgWaitMins', function () {
    if (this.isLoading || typeof this.avgWaitMins !== 'number') { return '\xa0'; }
    return `
      ${this.avgWaitMins.toLocaleString()}
      ${pluralize(this.avgWaitMins, 'min', {withoutCount: true})}
    `.trim();
  }),

  // Chart component data
  data: computed('waitMins', 'labels', function () {
    return {
      type: 'spline',
      x: 'x',
      columns: [
        ['x', ...this.get('labels')],
        ['Minutes', ...this.get('waitMins')],
      ],
      colors: {
        Minutes: '#666',
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
      tick: { format: '%A, %b %e' },
      show: false,
    },
    y: { show: false }
  },

  tooltip: {
    position: (data, width, height, element) => {
      let top = -50;
      let left = (element.getAttribute('width') - width) / 2;
      return ({ top, left });
    },
    format: {
      value: d3format(','),
    }
  },

  grid: computed('avgWaitMins', function () {
    return {
      lines: { front: false },
      y: {
        lines: [{
          value: this.get('avgWaitMins'),
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
  }),
  pastIntervalData: reads('requestPastData.lastSuccessful.value'),

  prevAvgWaitMins: computed('pastIntervalData.data.times_waiting.average', 'prevTotalWaitMins',
    function () {
      return Math.round(this.get('pastIntervalData.data.times_waiting.average') * 100) / 100;
    }
  ),

  // Percent change
  percentageChange: computed('prevAvgWaitMins', 'avgWaitMins', function () {
    if (this.prevAvgWaitMins && this.avgWaitMins) {
      const change = ((this.avgWaitMins - this.prevAvgWaitMins) / this.prevAvgWaitMins);
      const percent = change * 100;
      return (Math.round(percent * 10) / 10);
    }

    return 0;
  }),

  percentageChangeText: computed('percentageChange', function () {
    return `${Math.abs(this.percentageChange)}%`;
  }),

  percentChangeTitle: computed('prevAvgWaitMins', 'interval', function () {
    return [
      'Averaged',
      this.prevAvgWaitMins.toLocaleString(),
      pluralize(this.prevAvgWaitMins, 'min', {withoutCount: true}),
      `the previous ${this.interval}`
    ].join(' ');
  }),

  // Request chart data
  didReceiveAttrs() {
    this.get('requestData').perform();
    this.get('requestPastData').perform();
  }
});
