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
  classNames: [],

  @service storage: null,

  token: '',

  @computed('avgWaitMins')
  options(avgWaitMins) {
    return {
      title: { text: undefined },
      xAxis: { visible: false },
      yAxis: {
        visible: true,
        title: { text: undefined },
        plotLines: [{
          value: avgWaitMins,
          color: '#eaeaea',
          width: 1,
        }],
        labels: [],
        gridLineWidth: 0,
      },
      legend: { enabled: false },
      chart: {
        height: '25%',
        spacing: [5, 5, 5, 5],
      },
      plotOptions: {
        series: {
          color: '#666',
          lineWidth: 1,
          states: {  hover: { lineWidth: 2 } },
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
      subject: 'jobs',
      interval: intervalToSubinterval[interval],
      func: 'avg',
      name: 'times_waiting',
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
        const mins = value.value / 60;
        if (timesMap.hasOwnProperty(value.time)) {
          timesMap[value.time] += Math.round(mins);
        } else {
          timesMap[value.time] = Math.round(mins);
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
        name: 'count',
        type: 'spline',
        data: filteredData,
      }];
    }
  },

  @computed('filteredData')
  totalWaitMins(filteredData) {
    if (filteredData) {
      return filteredData.reduce((acc, val) => acc + val[1], 0);
    }
  },

  @computed('filteredData', 'totalWaitMins')
  avgWaitMins(filteredData, totalWaitMins) {
    if (filteredData) {
      if (filteredData.length === 0) { return 0; }
      return Math.round((totalWaitMins / filteredData.length) * 100) / 100;
    }
  },
});
