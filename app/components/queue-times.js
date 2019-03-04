import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
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

  // Current Interval Chart Data
  getPresentData: task(function* () {
    return yield this.get('insights.getChartData').perform(
      this.owner,
      this.interval,
      'jobs',
      'avg',
      ['times_waiting'],
      {
        calcAvg: true,
        private: this.private,
        customSerialize: (key, val) => [key, (Math.round((val / 60) * 100) / 100)],
      }
    );
  }),
  chartData: reads('getPresentData.lastSuccessful.value'),
  plotData: reads('chartData.data.times_waiting.plotData'),
  isLoading: reads('getPresentData.isRunning'),
  isEmpty: empty('plotData'),
  showPlaceholder: or('isLoading', 'isEmpty'),

  content: computed('plotData', function () {
    return [{
      name: 'Minutes',
      data: this.get('plotData'),
    }];
  }),

  avgWaitMins: computed('chartData.data.times_waiting.average', function () {
    return Math.round(this.get('chartData.data.times_waiting.average') * 100) / 100;
  }),

  avgWaitText: computed('isLoading', 'avgWaitMins', function () {
    if (this.isLoading || typeof this.avgWaitMins !== 'number') { return '\xa0'; }
    return `
      ${this.avgWaitMins.toLocaleString()}
      ${pluralize(this.avgWaitMins, 'min', {withoutCount: true})}
    `.trim();
  }),

  // Previous interval chart data
  getPastData: task(function* () {
    return yield this.get('insights.getChartData').perform(
      this.owner,
      this.interval,
      'jobs',
      'avg',
      ['times_waiting'],
      {
        endInterval: -1,
        calcAvg: true,
        private: this.private,
        customSerialize: (key, val) => [key, Math.round(val / 60)]
      }
    );
  }),
  pastIntervalData: reads('getPastData.lastSuccessful.value'),

  prevAvgWaitMins: computed('pastIntervalData.data.times_waiting.average', 'prevTotalWaitMins',
    function () {
      return Math.round(this.get('pastIntervalData.data.times_waiting.average') * 100) / 100;
    }
  ),

  // Percent change
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

  // Request chart data
  didReceiveAttrs() {
    this.get('getPresentData').perform();
    this.get('getPastData').perform();
  }
});
