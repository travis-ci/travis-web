import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import $ from 'jquery';
import moment from 'moment';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

const intervalMap = {
  day: {
    subInterval: '1hour',
    xAxisLabelFormat: '{value:%H:%M}',
    instanceLabel: 'today',
  },
  week: {
    subInterval: '1day',
    xAxisLabelFormat: '{value:%b %e}',
    instanceLabel: 'this week',
  },
  month: {
    subInterval: '1day',
    xAxisLabelFormat: '{value:%b %e}',
    instanceLabel: 'this month',
  },
};

const apiTimeBaseFormat = 'YYYY-MM-DD HH:mm:ss';
const apiTimeRequestFormat = `${apiTimeBaseFormat} UTC`;
// const apiTimeReceivedFormat = `${apiTimeBaseFormat} zz`;


export default Component.extend({
  classNames: ['insights-odyssey'],
  classNameBindings: ['isLoading:insights-odyssey--loading'],

  @service storage: null,

  token: '',

  @computed('interval')
  currentIntervalLabel(interval) {
    return intervalMap[interval].instanceLabel;
  },

  @computed('interval')
  options(interval) {
    return {
      title: { text: undefined, align: 'left', floating: false, color: '#666666' },
      xAxis: {
        type: 'datetime',
        lineColor: '#f3f3f3',
        labels: { format: intervalMap[interval].xAxisLabelFormat },
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
          step: 'center',
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
  },

  @computed('owner', 'interval', 'token')
  dataRequest(owner, interval, token) {
    // FIXME: replace with v3 calls when it is ready
    const apiToken = token || this.get('storage').getItem('travis.insightToken') || '';
    if (apiToken.length === 0) { return; }
    const insightEndpoint = 'https://travis-insights-production.herokuapp.com';
    let endTime = moment.utc();
    let startTime = moment.utc().subtract(1, interval);

    let insightParams = $.param({
      subject: 'jobs',
      interval: intervalMap[interval].subInterval,
      func: 'p95',
      name: 'gauge_running,gauge_waiting',
      owner_type: owner['@type'] === 'user' ? 'User' : 'Organization',
      owner_id: owner.id,
      token: apiToken,
      end_time: endTime.format(apiTimeRequestFormat),
      start_time: startTime.format(apiTimeRequestFormat),
    });
    const url = `${insightEndpoint}/metrics?${insightParams}`;

    return ObjectPromiseProxy.create({
      promise: fetch(url).then(response => {
        if (response.ok) {
          return response.json();
        } else { return false; }
      }).then(response => ({data: response}))
    });
  },

  @computed('dataRequest.data')
  filteredData(data) {
    if (data) {
      const reducedData = data.values.reduce((timesMap, value) => {
        if (typeof value.value !== 'number' || Number.isNaN(value.value)) { return timesMap; }
        if (timesMap[value.name].hasOwnProperty(value.time)) {
          timesMap[value.name][value.time] += value.value;
        } else {
          timesMap[value.name][value.time] = value.value;
        }
        return timesMap;
      }, { gauge_running: {}, gauge_waiting: {} });
      return reducedData;
    }
  },

  @computed('filteredData')
  isLoading(filteredData) {
    return !filteredData;
  },

  @computed('filteredData')
  isEmpty(filteredData) {
    return filteredData &&
      Object.keys(filteredData.gauge_running).length === 0 &&
      Object.keys(filteredData.gauge_waiting).length === 0;
  },

  @computed('filteredData')
  content(filteredData) {
    if (filteredData) {
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
        data: Object.entries(filteredData.gauge_running).map(
          ([key, val]) => [moment.utc(key).valueOf(), val]
        ),
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
        data: Object.entries(filteredData.gauge_waiting).map(
          ([key, val]) => [moment.utc(key).valueOf(), val]
        ),
      }];
    }
  },
});
