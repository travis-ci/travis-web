import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

const BUILDS_FILTER_LABELS = {
  all: 'All Builds',
  passed: 'Successful Builds',
  failed: 'Failed Builds',
  errored: 'Errored Builds',
  canceled: 'Canceled Builds',
};

const BUILDS_MAX_COLOR = {
  all: '#3eaaaf',
  passed: '#32ab52',
  failed: '#db4545',
  errored: '#ed7d5b',
  canceled: '#666666',
};

const BUILDS_MIN_COLOR = {
  all: '#cfeaeb',
  passed: '#ccead4',
  failed: '#f6d1d0',
  errored: '#fbdfd6',
  canceled: '#d9d9d9',
};

const BUILDS_QUERY_PARAMS = {
  all: 'all',
  passed: 'passed',
  failed: 'failed',
  errored: 'errored',
  canceled: 'canceled',
};

const START_DATE = new Date(new Date().setMonth(new Date().getMonth() - 11));

export default Component.extend({
  api: service(),
  buildFilterLabel: BUILDS_FILTER_LABELS['all'],
  buildYear: new Date().getFullYear(),
  buildMinColor: BUILDS_MIN_COLOR['all'],
  buildMaxColor: BUILDS_MAX_COLOR['all'],
  buildEmptyColor: '#f1f1f1',
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
  startDate: new Date(START_DATE.getFullYear(), START_DATE.getMonth(), 1),
  endDate: new Date(),

  selectedRepoIds: '',

  fetchHeatMapData: task(function* (url) {
    document.getElementsByClassName('heatmap-cal-container')[0].classList.add('visibility-hidden');
    document.getElementsByClassName('heatmap-spinner')[0].style.display = 'block';

    if (this.buildStatus !== 'all') {
      url = `/spotlight_summary?time_start=${this.startDate}&time_end=${this.endDate}&build_status=${this.buildStatus}`;
    }

    let repoId = this.get('selectedRepoIds');
    if (repoId != '') {
      url = `${url}&repo_id=${repoId}`;
    }

    let generateGraph = (result) => {
      let maxBuilds = 0;
      let heatmapData = {};

      result.data.map((r) => {
        let buildDate = Date.parse(r.time) / 1000;
        if (heatmapData[buildDate] === undefined) {
          heatmapData[buildDate] = 0;
        }
        heatmapData[buildDate] = heatmapData[buildDate] + r.builds;
        if (maxBuilds < heatmapData[buildDate]) {
          maxBuilds = heatmapData[buildDate];
        }
      });
      this.set('heatmapData', heatmapData);
      document.getElementById('insights-heatmap').innerHTML = '';
      let cal = new CalHeatMap(); // eslint-disable-line
      cal.init({
        itemSelector: '#insights-heatmap',
        domain: 'month',
        subDomain: 'day',
        range: 12,
        cellSize: 16,
        cellPadding: 1,
        cellRadius: 3.2,
        domainGutter: 10,
        tooltip: true,

        start: this.startDate,
        data: this.heatmapData,
        considerMissingDataAsZero: true,

        legend:
          maxBuilds !== 0
            ?
            [
              Math.ceil(maxBuilds / 4),
              Math.ceil(maxBuilds / 2),
              Math.ceil((maxBuilds * 3) / 4),
            ]
            : [1, 2, 3],
        displayLegend: true,
        legendCellSize: 16,
        legendCellPadding: 1,
        legendMargin: [20, 38, 0, 0],
        legendHorizontalPosition: 'right',
        legendColors: {
          min: this.buildMinColor,
          max: this.buildMaxColor,
          empty: this.buildEmptyColor,
        },

        itemName: 'build',
        subDomainDateFormat: '%b %d, %Y',

        animationDuration: 0,
      });

      document.getElementsByClassName('heatmap-cal-container')[0].classList.remove('visibility-hidden');
      document.getElementsByClassName('heatmap-spinner')[0].style.display = 'none';
      let heatmapScroll = document.getElementById('insights-heatmap-scroll');
      heatmapScroll.scrollLeft = heatmapScroll.scrollWidth;
    };

    let result = yield this.api.get(url);

    generateGraph(result);
  }),
  actions: {
    setBuildFilter(filter, dropdown) {
      dropdown.actions.close();

      this.set('buildFilterLabel', BUILDS_FILTER_LABELS[filter]);
      this.set('buildMaxColor', BUILDS_MAX_COLOR[filter]);
      this.set('buildMinColor', BUILDS_MIN_COLOR[filter]);
      this.set('buildStatus', BUILDS_QUERY_PARAMS[filter]);

      let sDate = this.startDate.toISOString().split('T')[0];
      let eDate = this.endDate.toISOString().split('T')[0];
      let url = `/spotlight_summary?time_start=${sDate}&time_end=${eDate}`;

      this.fetchHeatMapData.perform(url);
    },

    setBuildYear(filter, dropdown) {
      dropdown.actions.close();

      this.set('buildYear', filter);

      let sDate =
        this.buildYear !== new Date().getFullYear()
          ? new Date(this.buildYear, 0, 1)
          : new Date(START_DATE.getFullYear(), START_DATE.getMonth(), 1);
      let eDate =
        this.buildYear !== new Date().getFullYear()
          ? new Date(this.buildYear, 11, 31)
          : new Date();
      this.set('startDate', sDate);
      this.set('endDate', eDate);

      let url = `/spotlight_summary?time_start=${this.startDate}&time_end=${this.endDate}`;

      this.fetchHeatMapData.perform(url);
    },
  },

  didInsertElement() {
    let sDate = this.startDate.toISOString().split('T')[0];
    let eDate = this.endDate.toISOString().split('T')[0];
    let url = `/spotlight_summary?time_start=${sDate}&time_end=${eDate}`;
    this.fetchHeatMapData.perform(url);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let sDate = this.startDate.toISOString().split('T')[0];
    let eDate = this.endDate.toISOString().split('T')[0];
    this.set('selectedReposIds', this.selectedRepoIds);
    if (this.selectedRepoIds !== '') {
      let url = `/spotlight_summary?time_start=${sDate}&time_end=${eDate}`;
      this.fetchHeatMapData.perform(url);
    }
  },
});
