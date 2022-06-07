import Component from '@ember/component';
import { inject as service } from '@ember/service';
import moment from 'moment';

const dataSource = {
  data: null,
  extensions: {
    standardRangeSelector: {
      enabled: '1',
    },
    customRangeSelector: {
      enabled: '0',
    },
  },
  yAxis: [
    {
      plot: {
        value: 'Builds',
        type: 'line',
        aggregation: 'Sum',
        connectNullData: true,
        style: {
          'plot.null': {
            'stroke-dasharray': '-1'
          }
        }
      },
    },
    {
      plot: {
        value: 'Minutes',
        type: 'line',
        aggregation: 'Sum',
        connectNullData: true,
        style: {
          'plot.null': {
            'stroke-dasharray': '-1'
          }
        }
      },
    },
    {
      plot: {
        value: 'Credits',
        type: 'line',
        aggregation: 'Sum',
        connectNullData: true,
        style: {
          'plot.null': {
            'stroke-dasharray': '-1'
          }
        }
      },
    },
  ],
};

export default Component.extend({
  api: service(),

  title: 'Spotlight TimeSeries',
  width: '100%',
  height: 600,
  type: 'timeseries',
  dataFormat: 'json',
  dataSource: null,
  timeStart: '',
  timeEnd: '',
  selectedRepoIds: '',
  chartData: null,
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('selectedRepoIds', this.selectedRepoIds);
    this.set('timeStart', this.timeStart);
    this.set('timeEnd', this.timeEnd);
    this.set('chartData', this.currentRepos.data);
    if (this.chartData) {
      this.showGraph();
    }
  },
  renderTimeSeries: function (dataSource, container) {
    FusionCharts.ready(() => {  // eslint-disable-line
      new FusionCharts({  // eslint-disable-line
        type: this.type,
        width: this.width,
        height: this.height,
        renderAt: container,
        dataFormat: this.dataFormat,
        dataSource: dataSource,
      }).render();
    });
  },

  showGraph() {
    const graphData = this.chartData.map((item, index) => [
      moment(item.time).format('DD-MMM-YY'),
      item.builds,
      (item.duration / 60),
      item.credits,
      index,
    ]);

    const schema = {
      time: {
        name: 'Time',
        type: 'date',
        format: '%d-%b-%y',
      },
      builds: {
        name: 'Builds',
        type: 'number',
      },
      duration: {
        name: 'Minutes',
        type: 'number',
      },
      credits: {
        name: 'Credits',
        type: 'number',
      },
    };

    const fusionDataStore = new FusionCharts.DataStore();  // eslint-disable-line
    const fusionDataTable = fusionDataStore.createDataTable(graphData, [
      schema.time,
      schema.builds,
      schema.duration,
      schema.credits,
    ]);

    dataSource.data = fusionDataTable;

    this.set('dataSource', dataSource);

    this.renderTimeSeries(this.dataSource, 'time-series-container');
  },
});
