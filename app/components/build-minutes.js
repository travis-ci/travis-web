import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],
  private: false,

  insights: service(),

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

  dataRequest: computed('owner', 'interval', 'private', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['times_running'],
      {
        calcTotal: true,
        calcAvg: true,
        private: this.private,
        customTransform: (key, val) => [key, Math.round(val / 60)],
      }
    );
  }),

  aggregateData: computed('dataRequest.data', function () {
    const responseData = this.get('dataRequest.data');
    if (responseData) {
      return responseData.times_running;
    }
  }),

  isLoading: computed('aggregateData', function () {
    return !this.aggregateData;
  }),

  content: computed('aggregateData', function () {
    if (this.aggregateData) {
      return [{
        name: 'Minutes',
        data: this.aggregateData.chartData,
      }];
    }
  }),

  totalBuildMins: computed('aggregateData', function () {
    if (this.aggregateData) {
      return this.aggregateData.total;
    }
  }),

  avgBuildMins: computed('aggregateData', 'totalBuildMins', function () {
    if (this.aggregateData) {
      return this.aggregateData.average;
    }
  }),

  totalBuildText: computed('isLoading', 'totalBuildMins', function () {
    if (this.isLoading || typeof this.totalBuildMins !== 'number') { return '\xa0'; }
    return `
      ${this.totalBuildMins.toLocaleString()}
      ${pluralize(this.totalBuildMins, 'min', {withoutCount: true})}
    `.trim();
  }),
});
