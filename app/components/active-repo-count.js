import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],

  insights: service(),

  intervalSettings: computed(function () {
    return this.get('insights').getIntervalSettings();
  }),

  options: computed('interval', 'intervalSettings', 'avgRepos', function () {
    return {
      title: { text: undefined },
      xAxis: { visible: false, type: 'datetime' },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: this.avgRepos,
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

  dataRequest: computed('owner', 'interval', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'jobs',
      'sum',
      ['count_started'],
      { aggregator: 'count', calcAvg: true }
    );
  }),

  aggregateData: computed('dataRequest.data', function () {
    const responseData = this.get('dataRequest.data');
    if (responseData) {
      return responseData.count_started;
    }
  }),

  isLoading: computed('aggregateData', function () {
    return !this.aggregateData;
  }),

  content: computed('aggregateData', function () {
    if (this.aggregateData) {
      return [{
        name: 'Active Repositories',
        data: this.aggregateData.chartData,
      }];
    }
  }),

  avgRepos: computed('aggregateData', function () {
    if (this.aggregateData) {
      return Math.round(this.aggregateData.avgerage);
    }
  }),

  activeTotalRequest: computed('owner', 'interval', function () {
    return this.get('insights').getActiveRepos(
      this.owner,
      this.interval
    );
  }),

  activeTotal: computed('activeTotalRequest.data', function () {
    const responseData = this.get('activeTotalRequest.data');
    if (responseData) {
      return responseData.count;
    }
  }),

  activeTotalIsLoading: computed('activeTotal', function () {
    return typeof this.activeTotal !== 'number';
  }),
});
