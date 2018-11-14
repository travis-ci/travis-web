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
    subInterval: '10min',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
  },
  week: {
    subInterval: '1hour',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
  },
  month: {
    subInterval: '1day',
    tooltipLabelFormat: '%A, %b %e',
  },
};

const apiTimeBaseFormat = 'YYYY-MM-DD HH:mm:ss';
const apiTimeRequestFormat = `${apiTimeBaseFormat} UTC`;
const apiTimeReceivedFormat = `${apiTimeBaseFormat} zz`;

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],

  @service storage: null,

  token: '',

  @computed('interval', 'avgBuilds')
  options(interval, avgBuilds) {
    return {
      title: { text: undefined },
      xAxis: { visible: false, type: 'datetime' },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: avgBuilds,
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
        xDateFormat: intervalMap[interval].tooltipLabelFormat,
        outside: true,
        pointFormat: '<span>{series.name}: <b>{point.y}</b></span><br/>',
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
      subject: 'builds',
      interval: intervalMap[interval].subInterval,
      func: 'sum',
      name: 'count_started',
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
      return Object.entries(data.values.reduce((timesMap, value) => {
        if (timesMap.hasOwnProperty(value.time)) {
          timesMap[value.time] += value.value;
        } else {
          timesMap[value.time] = value.value;
        }
        return timesMap;
      }, {})).map(([key, val]) => [moment(key, apiTimeReceivedFormat).valueOf(), val]);
    }
  },

  @computed('filteredData')
  isLoading(filteredData) {
    return !filteredData;
  },

  @computed('filteredData')
  content(filteredData) {
    if (filteredData) {
      return [{
        name: 'Builds',
        data: filteredData,
      }];
    }
  },

  @computed('filteredData')
  totalBuilds(filteredData) {
    if (filteredData) {
      return filteredData.reduce((acc, val) => acc + val[1], 0);
    }
  },

  @computed('filteredData', 'totalBuilds')
  avgBuilds(filteredData, totalBuilds) {
    if (filteredData) {
      return totalBuilds / filteredData.length;
    }
  },

  @computed('isLoading', 'totalBuilds')
  totalBuildText(isLoading, totalBuilds) {
    if (isLoading) { return '\xa0'; }
    return totalBuilds.toLocaleString();
  },
});
