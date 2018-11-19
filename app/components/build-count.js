import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

const intervalMap = {
  day: {
    subInterval: '10min',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
  },
  week: {
    subInterval: '1hour',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
  },
  month: {
    subInterval: '1day',
    tooltipLabelFormat: '%A, %b %e',
  },
};

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],

  insights: service(),

  options: computed('interval', 'avgBuilds', function () {
    return {
      title: { text: undefined },
      xAxis: { visible: false, type: 'datetime' },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: this.avgBuilds,
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
        xDateFormat: intervalMap[this.interval].tooltipLabelFormat,
        outside: true,
        pointFormat: '<span>{series.name}: <b>{point.y}</b></span><br/>',
      },
    };
  }),

  dataRequest: computed('owner', 'interval', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
    );
  }),

  aggregateData: computed('dataRequest.data', function () {
    const responseData = this.get('dataRequest.data');
    if (responseData) {
      return Object.entries(responseData.count_started);
    }
  }),

  content: computed('aggregateData', function () {
    if (this.aggregateData) {
      return [{
        name: 'Builds',
        data: this.aggregateData,
      }];
    }
  }),

  isLoading: computed('aggregateData', function () {
    return !this.aggregateData;
  }),

  totalBuilds: computed('aggregateData', function () {
    if (this.aggregateData) {
      return this.aggregateData.reduce((acc, val) => acc + val[1], 0);
    }
  }),

  avgBuilds: computed('aggregateData', 'totalBuilds', function () {
    if (this.aggregateData) {
      return this.totalBuilds / this.aggregateData.length;
    }
  }),

  totalBuildText: computed('totalBuilds', function () {
    if (typeof this.totalBuilds !== 'number') { return '\xa0'; }
    return this.totalBuilds.toLocaleString();
  }),
});
