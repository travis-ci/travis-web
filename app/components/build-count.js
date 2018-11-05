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
  month: '1day'
}

export default Component.extend({
  tagName: 'div',
  classNames: ['insights-row__chart insights-row-chart'],

  @service storage: null,

  options: {
    title: { text: undefined },
    xAxis: { visible: false },
    yAxis: { visible: false },
    legend: { enabled: false },
    chart: {
      height: '25%',
    },
    plotOptions: {
      line: {
        color: '#666',
        lineWidth: 1,
        states: {  hover: { lineWidth: 2 } },
      },
    },
  },

  @computed('owner', 'interval')
  dataRequest(owner, interval) {
    // FIXME get a token the real way, unless v3 proxy work finishes first
    let insightToken = this.get('storage').getItem('travis.insight_token') || '';
    let insightEndpoint = 'https://travis-insights-production.herokuapp.com';
    let endTime = moment();
    let startTime = moment().subtract(1, interval);

    let insightParams = $.param({
      subject: 'builds',
      interval: intervalToSubinterval[interval],
      func: 'sum',
      name: 'count_started',
      owner_type: owner['@type'] === 'user' ? 'User' : 'Organization',
      owner_id: owner.id,
      token: insightToken,
      end_time: endTime.format('YYYY-MM-DD HH:mm:ss UTC'),
      start_time: startTime.format('YYYY-MM-DD HH:mm:ss UTC'),
    });
    let url = `${insightEndpoint}/metrics?${insightParams}`;

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
      return data.values.reduce((accumulator, value) => {
        if (!accumulator.processedTimes.includes(value.time)) {
          accumulator.processedTimes.push(value.time);
          accumulator.values.push(value);
        }
        return accumulator;
      }, {values: [], processedTimes: []}).values;
    } else {
      return [];
    }
  },

  @computed('filteredData')
  content(filteredData) {
    return [{
      name: 'count',
      type: 'spline',
      data: filteredData.map(value => [value.time, value.value]),
    }];
  },

  @computed('filteredData')
  totalBuilds(filteredData) {
    return filteredData.reduce((acc, val) => acc + val.value, 0);
  },
});
