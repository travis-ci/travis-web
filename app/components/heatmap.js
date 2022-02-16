import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

const BUILDS_FILTER_LABELS = {
  all: 'All Builds',
  failed: 'Failed Builds',
  passed: 'Successful Builds',
  errored: 'Errored Builds',
  canceled: 'Canceled Builds',
};

const BUILDS_MAX_COLOR = {
  all: '#04c2bf',
  failed: '#fc0303',
  passed: '#03fc4e',
  errored: '#db5c07',
  canceled: '#4f4f4f',
};

const BUILDS_MIN_COLOR = {
  all: '#D7F0E6',
  failed: '#FF7F7F',
  passed: '#90EE90',
  errored: '#efebd6',
  canceled: '#efebd6',
};

const BUILDS_QUERY_PARAMS = {
  all: 'all',
  failed: 'failed',
  success: 'successful',
  error: 'errored',
  cancel: 'canceled',
};

export default Component.extend({
  api: service(),
  buildFilterLabel: 'All Builds',
  buildYear: new Date().getFullYear(),
  buildMinColor: BUILDS_MIN_COLOR['all'],
  buildMaxColor: BUILDS_MAX_COLOR['all'],
  buildEmptyColor: '#efefef',
  buildStatus: BUILDS_QUERY_PARAMS['all'],
  heatmapData: {},
  buildYears: [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 3,
    new Date().getFullYear() - 4,
    new Date().getFullYear() - 5,
  ],
  fetchHeatMapData: task(function* (url) {
    return yield this.api
      .get(url)
      .then((result) => {
        let data = {};
        result.data.map((r) => {
          let dateConverted = Date.parse(r.time) / 1000;
          let prev = data[dateConverted];
          if (data[dateConverted] === undefined) {
            data[dateConverted] = r.builds;
          } else {
            let current = r.builds;
            let total = prev + current;
            data[dateConverted] = total;
          }
        });
        this.set('heatmapData', data);
        let cal = new CalHeatMap(); // eslint-disable-line
        cal.init({
          itemSelector: '#insights-heatmap',
          domain: 'month',
          range: 12,
          start: new Date(this.buildYear, 0, 1),
          subDomain: 'day',
          itemName: ['Build'],
          cellSize: 14,
          cellRadius: 0,
          cellPadding: 1,
          displayLegend: true,
          tooltip: true,
          domainMargin: [1, 1, 1, 1],
          legendHorizontalPosition: 'right',
          legendColors: {
            min: this.buildMinColor,
            max: this.buildMaxColor,
            empty: this.buildEmptyColor,
          },
          considerMissingDataAsZero: true,
          legend: [25, 50, 75, 100],
          legendCellSize: 14,
          data: this.heatmapData,
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  }),
  actions: {
    setBuildFilter(filter, dropdown) {
      document.getElementById('insights-heatmap').innerHTML = '';
      dropdown.actions.close();
      this.set('buildFilterLabel', BUILDS_FILTER_LABELS[filter]);
      this.set('buildMaxColor', BUILDS_MAX_COLOR[filter]);
      this.set('buildMinColor', BUILDS_MIN_COLOR[filter]);
      this.set('buildStatus', BUILDS_QUERY_PARAMS[filter]);
      let url = `/insights_spotlight_summary?time_start=${this.buildYear}-01-01&time_end=${this.buildYear}-12-31`;
      if (this.buildStatus !== 'all') {
        url = `/insights_spotlight_summary?time_start=${this.buildYear}-01-01&time_end=${this.buildYear}-12-31&build_status=${this.buildStatus}`;
      }
      this.fetchHeatMapData.perform(url);
    },
    setBuildYear(filter, dropdown) {
      document.getElementById('insights-heatmap').innerHTML = '';
      dropdown.actions.close();
      this.set('buildYear', filter);
      let url = `/insights_spotlight_summary?time_start=${this.buildYear}-01-01&time_end=${this.buildYear}-12-31`;
      if (this.buildStatus !== 'all') {
        url = `/insights_spotlight_summary?time_start=${this.buildYear}-01-01&time_end=${this.buildYear}-12-31&build_status=${this.buildStatus}`;
      }
      this.fetchHeatMapData.perform(url);
    },
  },
  didInsertElement() {
    let url = `/insights_spotlight_summary?time_start=${this.buildYear}-01-01&time_end=${this.buildYear}-12-31`;
    this.fetchHeatMapData.perform(url);
  },
});
