import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { reads, empty, or } from '@ember/object/computed';
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

  options: computed('interval', 'intervalSettings', 'avgBuildMins', function () {
    return {
      title: { text: undefined },
      xAxis: { visible: false, type: 'datetime' },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: this.avgBuildMins,
          color: '#eaeaea',
          width: 1,
        }],
        labels: [],
        gridLineWidth: 0,
      },
      legend: { enabled: false },
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
          marker: { enabled: false, radius: 2 },
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
      ['times_running'],
      {
        calcTotal: true,
        calcAvg: true,
        private: this.private,
        customSerialize: (key, val) => [key, Math.round(val / 60)],
      }
    );
  }),
  chartData: reads('requestData.lastSuccessful.value'),
  plotData: reads('chartData.data.times_running.plotData'),
  isLoading: reads('requestData.isRunning'),
  isEmpty: empty('plotData'),
  showPlaceholder: or('isLoading', 'isEmpty'),

  content: computed('plotData', function () {
    return [{
      name: 'Minutes',
      data: this.get('plotData'),
    }];
  }),

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

  // Request chart data
  didReceiveAttrs() {
    this.get('requestData').perform();
  }
});
