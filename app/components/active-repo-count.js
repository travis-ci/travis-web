import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, empty, or } from '@ember/object/computed';

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],
  private: false,

  insights: service(),

  // Chart options
  intervalSettings: computed(function () {
    return this.get('insights').getIntervalSettings();
  }),

  options: computed('interval', 'intervalSettings', 'avgRepos', function () {
    return {
      title: { text: undefined },
      xAxis: { visible: false, type: 'datetime' },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: this.avgRepos,
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
        xDateFormat: this.intervalSettings[this.interval].tooltipLabelFormat,
        outside: true,
        pointFormat: '<span>{series.name}: <b>{point.y}</b></span><br/>',
      },
    };
  }),

  // Chart data
  chartData: reads('insights.chartData.data.count_started'),
  isLoading: reads('insights.chartDataLoading'),
  isEmpty: empty('chartData.plotData'),
  showPlaceholder: or('isLoading', 'isEmpty'),

  content: computed('chartData.plotData', function () {
    return [{
      name: 'Active Repositories',
      data: this.get('chartData.plotData'),
    }];
  }),

  avgRepos: computed('chartData.average', function () {
    return Math.round(this.get('chartData.average'));
  }),

  // Active Repos has its own separate endpoint for totals, its calculation is somewhat unique
  activeTotal: reads('insights.activeRepos.data.count'),
  activeTotalIsLoading: reads('insights.activeReposLoading'),
  isAnythingLoading: or('isLoading', 'activeTotalIsLoading'),

  // Request chart data
  didReceiveAttrs() {
    this._super(...arguments);
    this.get('insights').getActiveRepos(this.owner, this.interval, this.private);
    this.get('insights.getChartData').perform(
      this.owner,
      this.interval,
      'jobs',
      'sum',
      ['count_started'],
      {
        aggregator: 'count',
        calcAvg: true,
        private: this.private,
      }
    );
  }
});
