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

  options: computed('interval', 'avgBuildMins', function () {
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
      ['times_running'],
    );
  }),

  aggregateData: computed('dataRequest.data', function () {
    const responseData = this.get('dataRequest.data');
    if (responseData) {
      return Object.entries(responseData.times_running).map(([key, val]) => [
        key,
        Math.round(val / 60)
      ]);
    }
  }),

  isLoading: computed('aggregateData', function () {
    return !this.aggregateData;
  }),

  content: computed('aggregateData', function () {
    if (this.aggregateData) {
      return [{
        name: 'Minutes',
        data: this.aggregateData,
      }];
    }
  }),

  totalBuildMins: computed('aggregateData', function () {
    if (this.aggregateData) {
      return Math.round(this.aggregateData.reduce((acc, val) => acc + val[1], 0));
    }
  }),

  avgBuildMins: computed('aggregateData', 'totalBuildMins', function () {
    if (this.aggregateData) {
      return this.totalBuildMins / this.aggregateData.length;
    }
  }),

  totalBuildText: computed('isLoading', 'totalBuildMins', function () {
    if (this.isLoading || typeof this.totalBuildMins !== 'number') { return '\xa0'; }
    return `${this.totalBuildMins.toLocaleString()} min${this.totalBuildMins === 1 ? '' : 's'}`;
  }),
});
