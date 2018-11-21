import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

const invervalOverrides = {
  day: {
    subInterval: '1min',
  },
};

export default Component.extend({
  classNames: ['insights-odyssey'],
  classNameBindings: ['isLoading:insights-odyssey--loading'],

  insights: service(),

  intervalSettings: computed(function () {
    return this.get('insights').getIntervalSettings(invervalOverrides);
  }),

  currentIntervalLabel: computed('interval', 'intervalSettings', function () {
    return this.intervalSettings[this.interval].instanceLabel;
  }),

  options: computed('interval', 'intervalSettings', function () {
    return {
      title: { text: undefined, align: 'left', floating: false, color: '#666666' },
      xAxis: {
        type: 'datetime',
        lineColor: '#f3f3f3',
        labels: { format: this.intervalSettings[this.interval].xAxisLabelFormat },
      },
      yAxis: {
        title: { text: undefined },
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
        type: 'area',
        height: '82%',
        plotBackgroundColor: '#fdfdfd',
      },
      plotOptions: {
        area: {
          // step: 'center',
          marker: { enabled: false, },
          lineWidth: 1,
        }
      },
      tooltip: {
        useHTML: true,
        pointFormat: `
          <div style="margin-top: 2px;">
            <span style="color:{point.color};">●</span> {series.name}: <b>{point.y}</b>
          </div>
        `,
      },
    };
  }),

  dataRequest: computed('owner', 'interval', function () {
    return this.get('insights').getMetric(
      this.owner,
      this.interval,
      'jobs',
      'max',
      ['gauge_running', 'gauge_waiting'],
      {intervalSettings: invervalOverrides}
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
      this.aggregateData.gauge_running.length === 0 &&
      this.aggregateData.gauge_waiting.length === 0;
  }),

  content: computed('aggregateData', function () {
    if (this.aggregateData) {
      return [{
        name: 'Running Jobs',
        color: '#39aa56',
        fillColor: {
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0, 'rgba(57, 170, 86, 0.7)'],
            [1, 'rgba(57, 170, 86, 0)'],
          ],
        },
        data: this.aggregateData.gauge_running,
      }, {
        name: 'Queued Jobs',
        color: '#3eaaaf',
        fillColor: {
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0, 'rgba(62, 170, 175, 0.7)'],
            [1, 'rgba(62, 170, 175, 0)'],
          ],
        },
        data: this.aggregateData.gauge_waiting,
      }];
    }
  }),
});
