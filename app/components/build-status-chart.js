import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

const invervalOverrides = {
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

  intervalSettings: computed(function () {
    return this.get('insights').getIntervalSettings(invervalOverrides);
  }),

  currentIntervalLabel: computed('interval', 'intervalSettings', function () {
    return this.intervalSettings[this.interval].instanceLabel;
  }),

  options: computed('interval', 'intervalSettings', function () {
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

  dataRequest: computed('owner', 'interval', 'private', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_passed', 'count_failed', 'count_errored', 'count_canceled'],
      {
        intervalSettings: invervalOverrides,
        private: this.private,
      }
    );
  }),

  aggregateData: computed('dataRequest.data', function () {
    const responseData = this.get('dataRequest.data');
    if (responseData) {
      return responseData;
    }
  }),

  isLoading: computed('aggregateData', function () {
    return !this.aggregateData;
  }),

  isEmpty: computed('aggregateData', function () {
    return this.aggregateData &&
      this.aggregateData.count_passed.chartData.length === 0 &&
      this.aggregateData.count_failed.chartData.length === 0 &&
      this.aggregateData.count_errored.chartData.length === 0 &&
      this.aggregateData.count_canceled.chartData.length === 0;
  }),

  hasNoBuilds: computed('isLoading', 'isEmpty', function () {
    let noBuilds = this.isLoading === false && this.isEmpty === true;
    if (noBuilds) {
      this.sendAction('setNoBuilds', true);
    }
    return noBuilds;
  }),

  content: computed('aggregateData', function () {
    if (this.aggregateData) {
      return [{
        name: 'Passing',
        color: 'rgba(57, 170, 86, 0.8)',
        data: this.aggregateData.count_passed.chartData,
      }, {
        name: 'Failing',
        color: 'rgba(219, 69, 69, 0.8)',
        data: this.aggregateData.count_failed.chartData,
      }, {
        name: 'Errored',
        color: 'rgba(237, 222, 63, 0.8)',
        data: this.aggregateData.count_errored.chartData,
      }, {
        name: 'Cancelled',
        color: 'rgba(157, 157, 157, 0.8)',
        data: this.aggregateData.count_canceled.chartData,
      }];
    }
  }),
});
