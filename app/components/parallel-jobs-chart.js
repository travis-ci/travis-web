import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, not, equal } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['insights-odyssey'],
  classNameBindings: ['isLoading:insights-odyssey--loading'],

  insights: service(),

  intervalSettings: computed(function () {
    return this.get('insights').getIntervalSettings();
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
        xDateFormat: this.intervalSettings[this.interval].tooltipLabelFormat,
        useHTML: true,
        pointFormat: `
          <div style="margin-top: 2px;">
            <span style="color:{point.color};">●</span> {series.name}: <b>{point.y}</b>
          </div>
        `,
      },
    };
  }),

  // Current Interval Chart Data
  requestData: task(function* () {
    return yield this.get('insights').getChartData.perform(
      this.owner,
      this.interval,
      'jobs',
      'max',
      ['gauge_running', 'gauge_waiting']
    );
  }),
  chartData: reads('requestData.lastSuccessful.value'),
  isLoading: reads('requestData.isRunning'),
  isNotLoading: not('isLoading'),

  running: reads('chartData.data.gauge_running.plotValues'),
  waiting: reads('chartData.data.gauge_waiting.plotValues'),

  labels: reads('chartData.labels'),
  total: reads('chartData.data.total'),
  isEmpty: equal('total', 0),

  data: computed('running', 'waiting', 'labels',
    () => ({
      types: { Running: 'area-step', Waiting: 'area-step' },
      columns: [
        ['Running', 2, 3],
        ['Waiting', 1, 0],
      ],
      colors: {
        Running: '#39aa56',
        Waiting: '#3eaaaf',
      }
    })
  ),
});
