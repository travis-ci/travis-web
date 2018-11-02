import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import $ from 'jquery';
import moment from 'moment';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

let intervalToSubinterval = {
  day: '1min',
  week: '10min',
  month: '1hour'
}

export default Component.extend({
  @service storage: null,

  options: {
    title: { text: undefined },
    xAxis: { visible: false },
    yAxis: { visible: false },
    legend: { enabled: false },
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
  content(data) {
    if (data) {
      let filteredData = data.values.reduce((accumulator, value) => {
        if (!accumulator.processedTimes.includes(value.time)) {
          accumulator.processedTimes.push(value.time);
          accumulator.values.push(value);
        }
        return accumulator;
      }, {values: [], processedTimes: []}).values;
      return [{
        name: 'count',
        type: 'spline',
        data: filteredData.map(value => [value.time, value.value]),
      }];
    }
  }
});
