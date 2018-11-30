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

  options: computed('interval', 'intervalSettings', 'avgBuilds', function () {
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

  dataRequest: computed('owner', 'interval', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
      { calcTotal: true, calcAvg: true }
    );
  }),

  aggregateData: computed('dataRequest.data', function () {
    const responseData = this.get('dataRequest.data');
    if (responseData) {
      return responseData.count_started;
    }
  }),

  content: computed('aggregateData', 'percentageChange', function () {
    if (this.aggregateData) {
      const chartData = this.aggregateData.chartData;
      if (typeof this.percentageChange === 'number' && this.percentageChange !== 0) {
        const [xVal, yVal] = chartData[chartData.length - 1];
        chartData[chartData.length - 1] = {
          x: xVal,
          y: yVal,
          marker: {
            enabled: true,
            fillColor: this.percentageChange > 0 ? '#39aa56' : '#db4545',
          }
        };
      }
      return [{
        name: 'Builds',
        data: chartData,
      }];
    }
  }),

  isLoading: computed('aggregateData', function () {
    return !this.aggregateData;
  }),

  totalBuilds: computed('aggregateData', function () {
    if (this.aggregateData) {
      return this.aggregateData.total;
    }
  }),

  avgBuilds: computed('aggregateData', 'totalBuilds', function () {
    if (this.aggregateData) {
      return this.aggregateData.average;
    }
  }),

  totalBuildText: computed('totalBuilds', function () {
    if (typeof this.totalBuilds !== 'number') { return '\xa0'; }
    return this.totalBuilds.toLocaleString();
  }),

  prevDataRequest: computed('owner', 'interval', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
      { startInterval: -2, endInterval: -1, calcTotal: true, calcAvg: true }
    );
  }),

  percentageChange: computed('prevDataRequest.data', 'totalBuilds', function () {
    const responseData = this.get('prevDataRequest.data');
    if (responseData && this.totalBuilds) {
      const previousTotal = responseData.count_started.total;
      const change = ((this.totalBuilds - previousTotal) / previousTotal);
      const percent = change * 100;
      return (Math.round(percent * 10) / 10);
    }

    return 0;
  }),

  percentageChangeText: computed('percentageChange', function () {
    return `${this.percentageChange >= 0 ? this.percentageChange : this.percentageChange * -1}%`;
  }),
});
