import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import $ from 'jquery';
import moment from 'moment';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

let intervalMap = {
  day: {
    subInterval: '1hour',
    xAxisLabelFormat: '{value:%H:%M}',
  },
  week: {
    subInterval: '1day',
    xAxisLabelFormat: '{value:%b %e}',
  },
  month: {
    subInterval: '1day',
    xAxisLabelFormat: '{value:%b %e}',
  },
};

export default Component.extend({
  classNames: ['insights-odyssey'],
  classNameBindings: ['isLoading:insights-odyssey--loading'],

  @service storage: null,

  token: '',

  @computed('interval')
  options(interval) {
    return {
      title: { text: undefined },
      xAxis: {
        type: 'datetime',
        lineColor: '#f3f3f3',
        labels: { format: intervalMap[interval].xAxisLabelFormat },
        // tickPositions: [],
      },
      yAxis: {
        title: { text: undefined },
        reversedStacks: false,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#f3f3f3',
        lineWidth: 1,
        lineColor: '#f3f3f3',
        tickAmount: 6,
      },
      legend: {
      },
      chart: {
        type: 'column',
        height: '82%',
        plotBackgroundColor: '#fdfdfd',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        }
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
      func: 'max',
      name: 'count_passed,count_failed,count_errored,count_canceled',
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
      }, { count_passed: {}, count_failed: {}, count_errored: {}, count_canceled: {} });
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
        name: 'Passing',
        color: '#39aa56',
        data: Object.entries(filteredData.count_passed).map(
          ([key, val]) => [(new Date(key)).valueOf(), val]
        ),
      }, {
        name: 'Failing',
        color: '#db4545',
        data: Object.entries(filteredData.count_failed).map(
          ([key, val]) => [(new Date(key)).valueOf(), val]
        ),
      }, {
        name: 'Errored',
        color: '#edde3f',
        data: Object.entries(filteredData.count_errored).map(
          ([key, val]) => [(new Date(key)).valueOf(), val]
        ),
      }, {
        name: 'Cancelled',
        color: '#9d9d9d',
        data: Object.entries(filteredData.count_canceled).map(
          ([key, val]) => [(new Date(key)).valueOf(), val]
        ),
      }];
    }
  },
});
