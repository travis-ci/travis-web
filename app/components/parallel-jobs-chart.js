import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import $ from 'jquery';
import moment from 'moment';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

let intervalToSubinterval = {
  day: '1hour',
  week: '1day',
  month: '1day',
};

export default Component.extend({
  classNames: ['insights-odyssey'],
  classNameBindings: ['isLoading:insights-odyssey--loading'],

  @service storage: null,

  token: '',

  @computed()
  options() {
    return {
      title: { text: undefined },
      // xAxis: { visible: false },
      // yAxis: { visible: false },
      legend: { enabled: true },
      chart: { },
      plotOptions: { },
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
      interval: intervalToSubinterval[interval],
      func: 'max',
      name: 'gauge_running,gauge_waiting',
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
      const reducedData = data.values.reduce((timesMap, value) => {
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
  content(filteredData) {
    if (filteredData) {
      return [{
        name: 'RUNNING JOBS',
        type: 'area',
        step: 'center',
        data: Object.entries(filteredData.gauge_running),
      },{
        name: 'QUEUED JOBS',
        type: 'area',
        step: 'center',
        data: Object.entries(filteredData.gauge_waiting),
      }];
    }
  },
});
