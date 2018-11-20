import Service, { inject as serviceInject } from '@ember/service';
import moment from 'moment';
import $ from 'jquery';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

const defaultIntervalSettings = {
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

  getIntervalSettings(customIntervalSettings = {}) {
    return $.extend(true, {}, defaultIntervalSettings, customIntervalSettings);
  },

  getMetric(owner,
    interval,
    subject,
    func,
    metrics = [],
    customIntervalSettings = {},
    customTransform = ((key, val) => [key, val])
  ) {
    const intervalSettings = this.getIntervalSettings(customIntervalSettings);
    const endTime = moment.utc();
    const startTime = moment.utc().subtract(1, interval);
    const options = {
      stringifyData: false,
      data: {
        subject: subject,
        interval: intervalSettings[interval].subInterval,
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

    const aggregator = this._getAggregator(func);
    const transformer = this._getTransformer(func);

    return ObjectPromiseProxy.create({
      promise: this.get('api').get(endpoints.metrics, options).then(response => {
        let aggData;

        // Data aggregation
        aggData = response.data.values.reduce(
          (timesMap, value) => {
            if (typeof value.value !== 'number' || Number.isNaN(value.value)) {
              return timesMap;
            }
            const timeKey = moment.utc(value.time, apiTimeReceivedFormat).valueOf();
            timesMap = aggregator(timesMap, value.name, timeKey, value.value);
            return timesMap;
          }, defaultTimesMap
        );

        // Secondary data transform - to prepare it for charts once aggregation is complete
        Object.entries(aggData).map(([metricKey, metricVal]) => {
          aggData[metricKey] = Object.entries(metricVal).map(([key, val]) => {
            let [newKey, newVal] = transformer(key, val);
            try {
              [newKey, newVal] = customTransform(newKey, newVal);
            } catch (e) {}
            return [newKey, newVal];
          });
        });

        return { data: aggData };
      }).catch(response => {
        // console.log('Err', response);
      }),
    });
  },

  _getAggregator(func) {
    switch (func) {
      case 'sum':
        return (map, name, time, value) => {
          if (map[name].hasOwnProperty(time)) {
            map[name][time] += value;
          } else {
            map[name][time] = value;
          }
          return map;
        };
      case 'max':
        return (map, name, time, value) => {
          if (map[name].hasOwnProperty(time)) {
            if (value > map[name][time]) {
              map[name][time] = value;
            }
          } else {
            map[name][time] = value;
          }
          return map;
        };
      case 'avg':
        return (map, name, time, value) => {
          if (map[name].hasOwnProperty(time)) {
            map[name][time][0]++;
            map[name][time][1] += value;
          } else {
            map[name][time] = [1, value];
          }
          return map;
        };
      // Don't know that there's a sensible default aggregator
      default:
        return (map, name, time, value) => map;
    }
  },

  _getTransformer(func) {
    switch (func) {
      case 'avg':
        return (key, val) => [Number(key), (val[1] / val[0])];
      default:
        return (key, val) => [Number(key), val];
    }
  },
});
