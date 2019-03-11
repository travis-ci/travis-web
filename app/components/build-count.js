import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { reads, equal, or } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],
  private: false,

  insights: service(),

  // Chart options
  intervalSettings: computed(function () {
    return this.get('insights').getIntervalSettings();
  }),

  options: computed('interval', 'intervalSettings', 'avgBuilds', function () {
    return {
      yAxis: {
        plotLines: [{
          value: this.avgBuilds,
          color: '#eaeaea',
          width: 1,
        }],
      },
      chart: {
        type: 'spline',
        height: '25%',
        spacing: [5, 5, 5, 5],
      },
      plotOptions: {
        series: {
          color: '#666',
          lineWidth: 1,
          states: {  hover: { lineWidth: 2, halo: { size: 8 } } },
          marker: { enabled: false },
        },
      },
      tooltip: {
        xDateFormat: this.intervalSettings[this.interval].tooltipLabelFormat,
        outside: true,
        pointFormat: '<span>{series.name}: <b>{point.y}</b></span><br/>',
      },
    };
  }),

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
      type: 'line',
      x: 'x',
      columns: [
        ['x', ...this.get('labels')],
        ['Builds', ...this.get('builds')],
      ],
    };
  }),

  // Chart component options
  axis: {
    x: {
      type: 'timeseries',
      tick: { format: '%Y-%m-%d' },
      show: false,
    },
    y: { show: false }
  },

  legend: { show: false },

  grid: computed('avgBuilds', function () {
    return {
      y: {
        lines: [{ value: this.get('avgBuilds') }],
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
  percentChangeTitle: computed('prevTotalBuilds', 'interval', 'intervalSettings', function () {
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
