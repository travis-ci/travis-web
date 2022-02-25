import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

const result = {
  '@type': 'insights_spotlight_summary',
  'data': [
    {
      'id': 3,
      'user_id': 1,
      'repo_id': '1',
      'build_status': 'complete',
      'repo_name': 'myrepo',
      'builds': 30,
      'minutes': 90,
      'credits': 6,
      'time': '2022-01-03T00:00:00.000Z'
    },
    {
      'id': 4,
      'user_id': 1,
      'repo_id': '2',
      'build_status': 'complete',
      'repo_name': 'yourRepo',
      'builds': 40,
      'minutes': 80,
      'credits': 8,
      'time': '2022-01-04T00:00:00.000Z'
    }
  ]
};

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
  passed: 'passed',
  errored: 'errored',
  canceled: 'canceled',
};

export default Component.extend({
  api: service(),
  buildFilterLabel: BUILDS_FILTER_LABELS['all'],
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
  createGraph: computed('selectedRepos', function () {
    console.log('selected repos from computed Grah ', this.selectedRepos);
  }),
  selectedRepoIds: '',
  fetchHeatMapData: task(function* (url) {
    let repoId = '';
    repoId = this.get('selectedRepoIds');
    if (repoId != '') {
      url = `${url}&repo_id=${repoId}`;
    }

    let generateGraph = (result) => {
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
      document.getElementById('insights-heatmap').innerHTML = '';
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
    };
    let result = yield this.api.get(url);
    generateGraph(result);
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
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('selectedReposIds', this.selectedRepoIds);
    let url = `/insights_spotlight_summary?time_start=${this.buildYear}-01-01&time_end=${this.buildYear}-12-31`;
    this.fetchHeatMapData.perform(url);
  },
});
