import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, empty, and, not } from '@ember/object/computed';
import { task } from 'ember-concurrency';

const intervalOverrides = {
  day: {
    subInterval: '1hour',
  },
  week: {
    subInterval: '1day',
    tooltipLabelFormat: '%A, %b %e',
  },
};

export default Component.extend({
  classNames: ['insights-odyssey'],
  classNameBindings: ['isLoading:insights-odyssey--loading'],
  private: false,

  insights: service(),

  // Chart Options
  intervalSettings: computed(function () {
    return this.get('insights').getIntervalSettings(intervalOverrides);
  }),

  currentIntervalLabel: computed('interval', 'intervalSettings', function () {
    return this.intervalSettings[this.interval].instanceLabel;
  }),

  oldOptions: computed('interval', 'intervalSettings', function () {
    return {
      title: { text: undefined },
      xAxis: {
        type: 'datetime',
        lineColor: '#f3f3f3',
        labels: { format: this.intervalSettings[this.interval].xAxisLabelFormat },
      },
      yAxis: {
        title: { text: undefined },
        reversedStacks: false,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#f3f3f3',
        lineWidth: 1,
        lineColor: '#f3f3f3',
        tickAmount: 6,
        allowDecimals: false,
      },
      legend: {
        itemStyle: {
          fontWeight: 400,
          fontSize: '10px',
          color: '#9d9d9d',
          textTransform: 'uppercase',
        },
      },
      chart: {
        type: 'column',
        height: '40%',
        plotBackgroundColor: '#fdfdfd',
      },
      plotOptions: {
        column: { stacking: 'normal' },
      },
      tooltip: {
        xDateFormat: this.intervalSettings[this.interval].tooltipLabelFormat,
        useHTML: true,
        pointFormat: `
          <div style="margin-top: 2px;">
            <span style="color:{point.color};">●</span> {series.name}: <b>{point.y}</b>
          </div>
        `,
      },
      responsive: {
        rules: [{
          condition: { maxWidth: 800 },
          chartOptions: {
            chart: { height: 400 },
          },
        }]
      },
    };
  }),

  options: computed('interval', 'intervalSettings', () => ({
    scales: {
      xAxes: [{
        type: 'time',
        stacked: true,
        gridLines: { display: false },
        categoryPercentage: 0.15,
      }],
      yAxes: [{
        stacked: true,
      }],
    }
  })),

  // Current Interval Chart Data
  requestData: task(function* () {
    return yield this.get('insights.getChartData').perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_passed', 'count_failed', 'count_errored', 'count_canceled'],
      {
        intervalSettings: intervalOverrides,
        private: this.private,
      }
    );
  }),
  chartData: reads('requestData.lastSuccessful.value'),
  isLoading: reads('requestData.isRunning'),
  isNotLoading: not('isLoading'),

  countPassed: reads('chartData.data.count_passed.plotValues'),
  countFailed: reads('chartData.data.count_failed.plotValues'),
  countErrored: reads('chartData.data.count_errored.plotValues'),
  countCanceled: reads('chartData.data.count_canceled.plotValues'),
  labels: reads('chartData.data.count_passed.plotLabels'),

  nonePassed: empty('countPassed'),
  noneFailed: empty('countFailed'),
  noneErrored: empty('countErrored'),
  noneCanceled: empty('countCanceled'),

  isEmpty: and('nonePassed', 'noneFailed', 'noneErrored', 'noneCanceled'),
  hasNoBuilds: and('isNotLoading', 'isEmpty'),

  content: computed('countPassed', 'countFailed', 'countErrored', 'countCanceled', 'labels',
    function () {
      return {
        datasets: [{
          label: 'Passing',
          backgroundColor: 'rgba(57, 170, 86, 0.8)',
          data: this.get('countPassed'),
        }, {
          label: 'Failing',
          backgroundColor: 'rgba(219, 69, 69, 0.8)',
          data: this.get('countFailed'),
        }, {
          label: 'Errored',
          backgroundColor: 'rgba(237, 222, 63, 0.8)',
          data: this.get('countErrored'),
        }, {
          label: 'Cancelled',
          backgroundColor: 'rgba(157, 157, 157, 0.8)',
          data: this.get('countCanceled'),
        }],
        labels: this.get('labels'),
      };
    }
  ),

  // Request chart data
  didReceiveAttrs() {
    this.get('requestData').perform();
  }
});
