import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import CalHeatMap from 'cal-heatmap';
import moment from 'moment';
import { computed } from '@ember/object';

const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

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
let initialRenderHeatmap = true;

export default Component.extend({
  api: service(),
  timeZone: '',
  browserTimeZone: '',
  convertToTimeZone(time) {
    if (this.timeZone !== '') {
      return moment(time, TIME_FORMAT).tz(this.timeZone);
    } else if (this.browserTimeZone !== '') {
      return moment(time, TIME_FORMAT).tz(this.browserTimeZone);
    } else {
      return moment(time, TIME_FORMAT).utc();
    }
  },
  convertTimeFromUTC(time) {
    if (this.timeZone !== '') {
      return moment.utc(time).tz(this.timeZone);
    } else if (this.browserTimeZone !== '') {
      return moment.utc(time).tz(this.browserTimeZone);
    } else {
      return moment.utc(time);
    }
  },
  buildFilterLabel: BUILDS_FILTER_LABELS['all'],
  currentYear: computed('convertToTimeZone', function () {
    return this.convertToTimeZone(moment()).startOf('day').format('YYYY');
  }),
  buildYear: computed('currentYear', function () {
    return this.currentYear;
  }),
  buildMinColor: BUILDS_MIN_COLOR['all'],
  buildMaxColor: BUILDS_MAX_COLOR['all'],
  buildEmptyColor: '#f1f1f1',
  buildStatus: BUILDS_QUERY_PARAMS['all'],
  heatmapData: {},
  buildYears: computed('currentYear', function () {
    return [
      this.currentYear,
      this.currentYear - 1,
      this.currentYear - 2,
      this.currentYear - 3,
      this.currentYear - 4,
      this.currentYear - 5,
    ];
  }),
  endDate: computed('convertToTimeZone', function () {
    return this.convertToTimeZone(moment()).endOf('day');
  }),
  startDate: computed('endDate', function () {
    return moment(this.endDate).subtract(11, 'months').startOf('month');
  }),
  selectedRepoIds: '',

  fetchHeatMapData: task(function* () {
    let startTime = this.startDate.format(TIME_FORMAT);
    let endTime = this.endDate.format(TIME_FORMAT);
    let startTimeInUTC = moment(this.startDate).utc().format(TIME_FORMAT);
    let endTimeInUTC = moment(this.endDate).utc().format(TIME_FORMAT);
    let isCurrentYear = (this.currentYear === this.buildYear);

    if (!isCurrentYear) {
      startTime = this.convertToTimeZone(moment().year(this.buildYear)).startOf('year');
      endTime = this.convertToTimeZone(moment().year(this.buildYear)).endOf('year');
      startTimeInUTC = moment(startTime).utc().format(TIME_FORMAT);
      endTimeInUTC = moment(endTime).utc().format(TIME_FORMAT);
      startTime = startTime.format(TIME_FORMAT);
      endTime = endTime.format(TIME_FORMAT);
    }
    let url = `/spotlight_summary?time_start=${startTimeInUTC}&time_end=${endTimeInUTC}`;
    document.getElementsByClassName('heatmap-cal-container')[0].classList.add('visibility-hidden');
    document.getElementsByClassName('heatmap-spinner')[0].style.display = 'block';

    if (this.buildStatus !== 'all') {
      url = `${url}&build_status=${this.buildStatus}`;
    }

    let repoId = this.get('selectedRepoIds');

    if (repoId != '') {
      url = `${url}&repo_id=${repoId}`;
    }

    let generateGraph = (result) => {
      let maxBuilds = 0;
      let heatmapData = {};

      result.data.map((r) => {
        let utcBuildDate = this.convertTimeFromUTC(r.time).format(TIME_FORMAT);
        let buildDate = Date.parse(utcBuildDate) / 1000;
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

        start: new Date(startTime),
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

      this.fetchHeatMapData.perform();
    },

    setBuildYear(filter, dropdown) {
      dropdown.actions.close();

      this.set('buildYear', filter);

      this.fetchHeatMapData.perform();
    },
  },

  didInsertElement() {
    this.fetchHeatMapData.perform();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('selectedReposIds', this.selectedRepoIds);
    this.set('timeZone', this.timeZone);
    this.set('browserTimeZone', this.browserTimeZone);
    if (!initialRenderHeatmap) {
      this.fetchHeatMapData.perform();
    }
    initialRenderHeatmap = false;
  },
});
