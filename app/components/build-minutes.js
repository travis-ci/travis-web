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
      ['times_running'],
      {
        calcAvg: true,
        private: this.private,
        customSerialize: (key, val) => [key, Math.round(val / 60)],
      }
    );
  }),
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
    return `
      ${this.totalBuildMins.toLocaleString()}
      ${pluralize(this.totalBuildMins, 'min', {withoutCount: true})}
    `.trim();
  }),

  // Chart component data
  data: computed('buildMins', 'labels', function () {
    return {
      type: 'spline',
      x: 'x',
      columns: [
        ['x', ...this.get('labels')],
        ['Minutes', ...this.get('buildMins')],
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

  grid: computed('avgBuildMins', function () {
    return {
      lines: { front: false },
      y: {
        lines: [{
          value: this.get('avgBuildMins'),
          class: 'insights-glance__centerline',
        }],
      }
    };
  }),

  // Request chart data
  didReceiveAttrs() {
    this.get('requestData').perform();
  }
});
