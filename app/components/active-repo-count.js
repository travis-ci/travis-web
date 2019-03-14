import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { format as d3format } from 'd3';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],
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

  // Chart component data
  data: computed('activeRepos', 'labels', function () {
    return {
      type: 'spline',
      x: 'x',
      columns: [
        ['x', ...this.get('labels')],
        ['Active Repositories', ...this.get('activeRepos')],
      ],
      colors: {
        'Active Repositories': '#666',
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

  grid: computed('avgRepos', function () {
    return {
      lines: { front: false },
      y: {
        lines: [{
          value: this.get('avgRepos'),
          class: 'insights-glance__centerline',
        }],
      }
    };
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
