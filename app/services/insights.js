import Service, { inject as service } from '@ember/service';
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
    prevInstanceLabel: 'yesterday',
  },
  week: {
    subInterval: '1day',
    tooltipLabelFormat: '%A, %b %e, %H:%M',
    xAxisLabelFormat: '{value:%b %e}',
    instanceLabel: 'this week',
    prevInstanceLabel: 'last week',
  },
  month: {
    subInterval: '1day',
    tooltipLabelFormat: '%A, %b %e',
    xAxisLabelFormat: '{value:%b %e}',
    instanceLabel: 'this month',
    prevInstanceLabel: 'last month',
  },
};

const defaultOptions = {
  intervalSettings: {},
  calcTotal: false,
  calcAvg: false,
  private: false,
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
  api: service(),

  getIntervalSettings(customIntervalSettings = {}) {
    return $.extend(true, {}, defaultIntervalSettings, customIntervalSettings);
  },

  getDatesFromInterval(interval, startInterval, endInterval = 0) {
    // Have startInterval default to 1 less than endInterval
    startInterval = typeof startInterval !== 'number' ? endInterval - 1 : startInterval;

    return [
      moment.utc().add(startInterval, interval),
      moment.utc().add(endInterval, interval)
    ];
  },

  getMetric(owner,
    interval,
    subject,
    func,
    metrics = [],
    options = {}
  ) {
    const currentOptions = $.extend(true, {}, defaultOptions, options);
    currentOptions.aggregator = currentOptions.aggregator || func;
    currentOptions.transformer = currentOptions.transformer || func;
    const intervalSettings = this.getIntervalSettings(currentOptions.intervalSettings);

    const [startTime, endTime] = this.getDatesFromInterval(
      interval,
      currentOptions.startInterval,
      currentOptions.endInterval
    );

    const apiSettings = {
      stringifyData: false,
      data: {
        subject,
        interval: intervalSettings[interval].subInterval,
        func,
        name: metrics.join(','),
        owner_type: owner['@type'] === 'user' ? 'User' : 'Organization',
        owner_id: owner.id,
        end_time: endTime.format(apiTimeRequestFormat),
        start_time: startTime.format(apiTimeRequestFormat),
        private: currentOptions.private,
      }
    };
    const defaultTimesMap = metrics.reduce((map, metric) => {
      map[metric] = {};
      return map;
    }, {});

    const aggregator = this._getAggregator(currentOptions.aggregator);
    const transformer = this._getTransformer(currentOptions.transformer);

    return ObjectPromiseProxy.create({
      promise: this.get('api').get(endpoints.metrics, apiSettings).then(response => {
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
        Object.entries(aggData).map(([mKey, mVal]) => {
          aggData[mKey].chartData = Object.entries(mVal).map(([key, val]) => {
            let [newKey, newVal] = transformer(key, val);
            if (typeof currentOptions.customTransform === 'function') {
              try {
                [newKey, newVal] = currentOptions.customTransform(newKey, newVal);
              } catch (e) {}
            }
            return [newKey, newVal];
          });

          if (currentOptions.calcTotal || currentOptions.calcAvg) {
            aggData[mKey].total = aggData[mKey].chartData.reduce((acc, [key, val]) => acc + val, 0);
          }

          if (currentOptions.calcAvg) {
            aggData[mKey].average = aggData[mKey].chartData.length === 0
              ? 0
              : aggData[mKey].total / aggData[mKey].chartData.length
            ;
          }
        });

        return { data: aggData, private: response.data.private === 'true' };
      }).catch(response => {
        // console.log('Err', response);
      }),
    });
  },

  _getAggregator(aggName) {
    switch (aggName) {
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
      case 'count':
        return (map, name, time, value) => {
          if (map[name].hasOwnProperty(time)) {
            map[name][time]++;
          } else {
            map[name][time] = 1;
          }
          return map;
        };
      // Don't know that there's a sensible default aggregator
      default:
        return (map, name, time, value) => map;
    }
  },

  _getTransformer(transformerName) {
    switch (transformerName) {
      case 'avg':
        return (key, val) => [Number(key), (val[1] / val[0])];
      default:
        return (key, val) => [Number(key), val];
    }
  },

  getActiveRepos(owner, interval, requestPrivate = false) {
    const endTime = moment.utc();
    const startTime = moment.utc().subtract(1, interval);

    const apiSettings = {
      stringifyData: false,
      data: {
        owner_type: owner['@type'] === 'user' ? 'User' : 'Organization',
        owner_id: owner.id,
        end_time: endTime.format(apiTimeRequestFormat),
        start_time: startTime.format(apiTimeRequestFormat),
        private: requestPrivate,
      }
    };

    return ObjectPromiseProxy.create({
      promise: this.get('api').get(endpoints.activeRepos, apiSettings).then(response => ({
        data: response.data
      })).catch(response => {
        // console.log('Err', response);
      }),
    });
  },
});
