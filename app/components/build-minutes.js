import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import $ from 'jquery';
import moment from 'moment';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

let intervalToSubinterval = {
  day: '10min',
  week: '1hour',
  month: '1day',
};

export default Component.extend({
  classNames: ['insights-glance'],
  classNameBindings: ['isLoading:insights-glance--loading'],

  @service storage: null,

  token: '',

  @computed('avgBuildMins')
  options(avgBuildMins) {
    return {
      title: { text: undefined },
      xAxis: { visible: false },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: avgBuildMins,
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
    };
  },

  @computed('owner', 'interval', 'token')
  dataRequest(owner, interval, token) {
    // FIXME: replace with v3 calls when it is ready
    const apiToken = token || this.get('storage').getItem('travis.insightToken') || '';
    if (apiToken.length === 0) { return; }
    const insightEndpoint = 'https://travis-insights-production.herokuapp.com';
    let endTime = moment();
    let startTime = moment().subtract(1, interval);

    let insightParams = $.param({
      subject: 'builds',
      interval: intervalToSubinterval[interval],
      func: 'sum',
      name: 'times_running',
      owner_type: owner['@type'] === 'user' ? 'User' : 'Organization',
      owner_id: owner.id,
      token: apiToken,
      end_time: endTime.format('YYYY-MM-DD HH:mm:ss UTC'),
      start_time: startTime.format('YYYY-MM-DD HH:mm:ss UTC'),
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
          timesMap[value.time] += Math.round(value.value / 60);
        } else {
          timesMap[value.time] = Math.round(value.value / 60);
        }
        return timesMap;
      }, {}));
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
        name: 'Minutes',
        data: filteredData,
      }];
    }
  },

  @computed('filteredData')
  totalBuildMins(filteredData) {
    if (filteredData) {
      return Math.round(filteredData.reduce((acc, val) => acc + val[1], 0));
    }
  },

  @computed('filteredData', 'totalBuildMins')
  avgBuildMins(filteredData, totalBuildMins) {
    if (filteredData) {
      return totalBuildMins / filteredData.length;
    }
  },
});
