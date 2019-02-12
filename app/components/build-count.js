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

  dataRequest: computed('owner', 'interval', 'private', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
      {
        calcTotal: true,
        calcAvg: true,
        private: this.private,
      }
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
      { endInterval: -1, calcTotal: true, calcAvg: true }
    );
  }),

  prevAggregateData: computed('prevDataRequest.data', function () {
    const responseData = this.get('prevDataRequest.data');
    if (responseData) {
      return responseData.count_started;
    }
  }),

  prevTotalBuilds: computed('prevAggregateData', function () {
    if (this.prevAggregateData) {
      return this.prevAggregateData.total;
    }
  }),

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
});
