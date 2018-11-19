import Service, { inject as serviceInject } from '@ember/service';
// import { computed } from '@ember/object';
import moment from 'moment';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

const defaultIntervalMap = {
  day: {
    subInterval: '10min',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
    xAxisLabelFormat: '{value:%H:%M}',
    instanceLabel: 'today',
  },
  week: {
    subInterval: '1hour',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
    xAxisLabelFormat: '{value:%b %e}',
    instanceLabel: 'this week',
  },
  month: {
    subInterval: '1day',
    tooltipLabelFormat: '%A, %b %e',
    xAxisLabelFormat: '{value:%b %e}',
    instanceLabel: 'this month',
  },
};

const apiTimeBaseFormat = 'YYYY-MM-DD HH:mm:ss';
const apiTimeRequestFormat = `${apiTimeBaseFormat} UTC`;
const apiTimeReceivedFormat = `${apiTimeBaseFormat} zz`;

const baseEndpoint = '/insights';
const endpoints = {
  metrics: `${baseEndpoint}/metrics`,
  activeRepos: `${baseEndpoint}/repos/active`
};

export default Service.extend({
  api: serviceInject(),

  // intervalMap: {},

  getMetric(owner, interval, subject, func, metrics = []) {
    const endTime = moment.utc();
    const startTime = moment.utc().subtract(1, interval);
    const options = {
      stringifyData: false,
      data: {
        subject: subject,
        interval: defaultIntervalMap[interval].subInterval,
        func: func,
        name: metrics.join(','),
        owner_type: owner['@type'] === 'user' ? 'User' : 'Organization',
        owner_id: owner.id,
        end_time: endTime.format(apiTimeRequestFormat),
        start_time: startTime.format(apiTimeRequestFormat),
      }
    };
    const defaultTimesMap = metrics.reduce((map, metric) => {
      map[metric] = {};
      return map;
    }, {});

    return ObjectPromiseProxy.create({
      promise: this.get('api').get(endpoints.metrics, options).then(response => {
        let aggData = response.data.values.reduce(
          (timesMap, value) => {
            if (typeof value.value !== 'number' || Number.isNaN(value.value)) { return timesMap; }
            const timeKey = moment.utc(value.time, apiTimeReceivedFormat).valueOf();
            if (timesMap[value.name].hasOwnProperty(timeKey)) {
              switch (func) {
                case 'sum':
                  timesMap[value.name][timeKey] += value.value;
                  break;
                case 'max':
                  if (value.value > timesMap[value.name][timeKey]) {
                    timesMap[value.name][timeKey] = value.value;
                  }
                  break;
              }
            } else {
              timesMap[value.name][timeKey] = value.value;
            }
            return timesMap;
          }, defaultTimesMap
        );
        return { data: aggData };
      }),
    });
  },
});
