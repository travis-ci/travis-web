import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { pluralize } from 'ember-inflector';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],

  insights: service(),

  intervalSettings: computed(function () {
    return this.get('insights').getIntervalSettings();
  }),

  options: computed('interval', 'intervalSettings', 'avgWaitMins', function () {
    return {
      title: { text: undefined },
      xAxis: { visible: false, type: 'datetime' },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: this.avgWaitMins,
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
      'jobs',
      'avg',
      ['times_waiting'],
      { calcTotal: true, calcAvg: true, customTransform: (key, val) => [key, Math.round(val / 60)] }
    );
  }),

  aggregateData: computed('dataRequest.data', function () {
    const responseData = this.get('dataRequest.data');
    if (responseData) {
      return responseData.times_waiting;
    }
  }),

  isLoading: computed('aggregateData', function () {
    return !this.aggregateData;
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
        name: 'Minutes',
        data: chartData,
      }];
    }
  }),

  totalWaitMins: computed('aggregateData', function () {
    if (this.aggregateData) {
      return this.aggregateData.total;
    }
  }),

  avgWaitMins: computed('aggregateData', function () {
    if (this.aggregateData) {
      return Math.round(this.aggregateData.average * 100) / 100;
    }
  }),

  avgWaitText: computed('isLoading', 'avgWaitMins', function () {
    if (this.isLoading || typeof this.avgWaitMins !== 'number') { return '\xa0'; }
    return `
      ${this.avgWaitMins.toLocaleString()}
      ${pluralize(this.avgWaitMins, 'min', {withoutCount: true})}
    `.trim();
  }),

  prevDataRequest: computed('owner', 'interval', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'jobs',
      'avg',
      ['times_waiting'],
      {
        startInterval: -2,
        endInterval: -1,
        calcTotal: true,
        calcAvg: true,
        customTransform: (key, val) => [key, Math.round(val / 60)]
      }
    );
  }),

  prevAggregateData: computed('prevDataRequest.data', function () {
    const responseData = this.get('prevDataRequest.data');
    if (responseData) {
      return responseData.times_waiting;
    }
  }),

  prevTotalWaitMins: computed('prevAggregateData', function () {
    if (this.prevAggregateData) {
      return this.prevAggregateData.total;
    }
  }),

  prevAvgWaitMins: computed('prevAggregateData', 'prevTotalWaitMins', function () {
    if (this.prevAggregateData) {
      return Math.round(this.prevAggregateData.average * 100) / 100;
    }
  }),

  percentageChange: computed('prevAvgWaitMins', 'avgWaitMins', function () {
    if (this.prevAvgWaitMins && this.avgWaitMins) {
      const change = ((this.avgWaitMins - this.prevAvgWaitMins) / this.prevAvgWaitMins);
      const percent = change * 100;
      return (Math.round(percent * 10) / 10);
    }

    return 0;
  }),

  percentageChangeText: computed('percentageChange', function () {
    return `${Math.abs(this.percentageChange)}%`;
  }),

  percentChangeTitle: computed('prevAvgWaitMins', 'interval', 'intervalSettings', function () {
    return [
      'Averaged',
      this.prevAvgWaitMins.toLocaleString(),
      pluralize(this.prevAvgWaitMins, 'min', {withoutCount: true}),
      `the previous ${this.interval}`
    ].join(' ');
  }),
});
