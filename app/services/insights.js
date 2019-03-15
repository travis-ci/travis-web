import Service, { inject as service } from '@ember/service';
import moment from 'moment';
import { assign } from '@ember/polyfills';
import { task } from 'ember-concurrency';
import { singularize } from 'ember-inflector';

const validIntervals = ['week', 'month'];
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
  raven: service(),
  flashes: service(),

  getIntervalSettings(customIntervalSettings = {}) {
    // Merge and assign, I don't think do deep merges, but interval settings is only ever 2 levels
    // deep so all we need to do is loop through each interval and do a shallow merge
    const settings =  validIntervals.reduce((acc, interval) => {
      acc[interval] = {};
      if (customIntervalSettings.hasOwnProperty(interval)) {
        assign(acc[interval], defaultIntervalSettings[interval], customIntervalSettings[interval]);
      } else {
        assign(acc[interval], defaultIntervalSettings[interval]);
      }
      return acc;
    }, {});
    return settings;
  },

  getDatesFromInterval(interval, startInterval, endInterval = 0) {
    // Have startInterval default to 1 less than endInterval
    endInterval = typeof endInterval !== 'number' ? 0 : endInterval;
    startInterval = typeof startInterval !== 'number' ? endInterval - 1 : startInterval;

    if (startInterval > endInterval) {
      [startInterval, endInterval] = [endInterval, startInterval];
    } else if (startInterval === endInterval) {
      startInterval--;
    }

    startInterval = convertIntervalToDays(interval, startInterval);
    endInterval = convertIntervalToDays(interval, endInterval);

    let start = moment.utc().add(startInterval, 'day');
    let end = moment.utc().add(endInterval, 'day');

    if (interval === 'day') {
      start = start.startOf('hour');
    } else {
      start = start.add(1, 'day').startOf('day');
    }

    return [start, end];
  },

  getChartData: task(function* (owner, interval, subject, func, metricNames = [], options = {}) {
    /* Prepare for API request to fetch metrics */
    const currentOptions = mergeMetricSettings(options, func);
    const intervalSettings = this.getIntervalSettings(currentOptions.intervalSettings);
    const subInterval = intervalSettings[interval].subInterval;

    const [startTime, endTime] = this.getDatesFromInterval(
      interval, currentOptions.startInterval, currentOptions.endInterval
    );

    const apiSettings = getMetricAPISettings(
      subject, func, subInterval, metricNames, owner, startTime, endTime, currentOptions
    );

    /* Fetch metrics */
    let metrics = yield this.get('fetchMetrics').perform(apiSettings, currentOptions);

    let labels = createLabels(startTime, endTime, subInterval);

    /* Prepare fetched metric data for charts */
    let data = aggregateMetrics(
      metricNames, metrics, currentOptions.aggregator, assign({}, labels), subInterval
    );

    serializeMetrics(data, metricNames, currentOptions);

    labels = Object.entries(labels).map(([key, val]) => key);

    return { data, private: metrics.data.private === 'true', labels, metrics };
  }),

  fetchMetrics: task(function* (apiSettings) {
    let metrics = yield this.get('api').get(endpoints.metrics, apiSettings) || [];
    return metrics;
  }),

  // Active Repo endpoint functions
  getActiveRepos(owner, interval, requestPrivate = false) {
    const [startTime, endTime] = this.getDatesFromInterval(interval);

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

    return this.fetchActiveRepos.perform(apiSettings);
  },

  fetchActiveRepos: task(function* (apiSettings) {
    let activeRepos = yield this.get('api').get(endpoints.activeRepos, apiSettings) || [];
    return activeRepos;
  }),
});

// Metric preparation functions
function getMetricAPISettings(
  subject, func, subInterval, metricNames, owner, startTime, endTime, options
) {
  return {
    stringifyData: false,
    data: {
      subject,
      interval: subInterval,
      func,
      name: metricNames.join(','),
      owner_type: owner['@type'] === 'user' ? 'User' : 'Organization',
      owner_id: owner.id,
      end_time: endTime.format(apiTimeRequestFormat),
      start_time: startTime.format(apiTimeRequestFormat),
      private: options.private,
    },
  };
}

function mergeMetricSettings(options, func) {
  const currentOptions = assign({}, defaultOptions, options);
  currentOptions.aggregator = currentOptions.aggregator || func;
  currentOptions.serializer = currentOptions.serializer || func;
  return currentOptions;
}

function convertIntervalToDays(interval, amount) {
  switch (interval) {
    case 'month':
      return 30 * amount;
    case 'week':
      return 7 * amount;
    case 'day':
      return amount;

    default:
      throw new Error('An invalid interval was specified');
  }
}

function getSubintervalDetails(subInterval) {
  switch (subInterval) {
    case '1min':
      return {step: 1, intervalName: 'minutes', keyFormat: 'YYYY-MM-DD HH:mm'};
    case '10min':
      return {step: 10, intervalName: 'minutes', keyFormat: 'YYYY-MM-DD HH:mm'};
    case '1hour':
      return {step: 1, intervalName: 'hours', keyFormat: 'YYYY-MM-DD HH'};
    case '1day':
      return {step: 1, intervalName: 'days', keyFormat: 'YYYY-MM-DD'};

    default:
      throw new Error('An invalid sub-interval was specified');
  }
}

function createLabels(startTime, endTime, subInterval) {
  const labels = {};
  let { step, intervalName } = getSubintervalDetails(subInterval);

  let current = moment.utc(startTime).startOf(singularize(intervalName));
  if (step !== 1) {
    let units = current[intervalName]();
    let remainder = units % step;
    current[intervalName](units - remainder);
  }

  while (current < endTime) {
    labels[formatTimeKey(current, subInterval)] = 0;
    current.add(step, intervalName);
  }

  return labels;
}

function formatTimeKey(time, subInterval) {
  const { keyFormat } = getSubintervalDetails(subInterval);
  return moment.utc(time).format(keyFormat);
}

function aggregateMetrics(metricNames, metrics, aggregatorName, labels, subInterval) {
  const defaultData = metricNames.reduce((map, metric) => {
    map[metric] = assign({}, labels);
    return map;
  }, {});

  // Aggregate metric data
  const aggregator = getAggregator(aggregatorName);

  // Data aggregation
  let aggData = metrics.data.values.reduce((timesMap, { value, time, name }) => {
    // Continue is value is invalid
    if (typeof value !== 'number' || Number.isNaN(value)) { return timesMap; }

    // Create key for map from time
    const timeKey = formatTimeKey(moment.utc(time, apiTimeReceivedFormat), subInterval);

    // Aggregate and continue building map
    timesMap = aggregator(timesMap, name, timeKey, value);
    return timesMap;
  }, defaultData);

  return aggData;
}

function serializeMetrics(serData, metricNames, currentOptions) {
  const serializer = getSerializer(currentOptions.serializer);
  let total = 0, avgs = [];

  // Loop through each metric
  metricNames.map((metricName) => {
    let currentMetric = serData[metricName];

    // Run serializer on each data point
    let plotData = Object.entries(currentMetric).map(([key, val]) => {
      // Run chosen serializer
      let [newKey, newVal] = serializer(key, val);

      // Run additional custom serializer if relevant
      if (typeof currentOptions.customSerialize === 'function') {
        try { [newKey, newVal] = currentOptions.customSerialize(newKey, newVal); } catch (e) {}
      }

      return [newKey, newVal];
    });
    currentMetric.plotData = plotData;

    // Split into labels and values - works better for some charting libraries
    currentMetric.plotLabels = currentMetric.plotData.map(([key, val]) => key);
    currentMetric.plotValues = currentMetric.plotData.map(([key, val]) => val);

    // Calculate total
    currentMetric.total = currentMetric.plotValues.reduce((acc, val) => acc + val, 0);
    total += currentMetric.total;

    // Calculate average if requested. Uses total calculated above.
    if (currentOptions.calcAvg) {
      const filtered = currentMetric.plotValues.filter(v => v !== 0);
      currentMetric.average = filtered.length === 0 ? 0 : currentMetric.total / filtered.length;
      avgs.push(currentMetric.average);
    }
  });

  // Calculate grand total / average of all metrics
  serData.total = total;
  if (currentOptions.calcAvg) {
    let avgsTotal = avgs.reduce((a, v) => a + v, 0);
    serData.average = avgs.length === 0 ? 0 : avgsTotal / avgs.length;
  }

  return serData;
}

// These aggregator functions are for aggregating data when there is a key collision, i.e. when
// there are multiple values for a given time. This happens on the owner page because repos are
// the main thing that the insights app aggregates data around
function getAggregator(aggName) {
  switch (aggName) {
    case 'sum':
      return sumAggregator;
    case 'max':
      return maxAggregator;
    case 'avg':
      return avgAggregator;
    case 'count':
      return countAggregator;

    // Don't know that there's a sensible default aggregator
    default:
      throw new Error('An invalid insights aggregator was specified');
  }
}

function sumAggregator(map, name, time, value) {
  if (map[name].hasOwnProperty(time)) {
    map[name][time] += value;
  } else {
    map[name][time] = value;
  }
  return map;
}

function maxAggregator(map, name, time, value) {
  if (map[name].hasOwnProperty(time)) {
    if (value > map[name][time]) {
      map[name][time] = value;
    }
  } else {
    map[name][time] = value;
  }
  return map;
}

function avgAggregator(map, name, time, value) {
  // if (value === 0) { return map; }
  if (map[name].hasOwnProperty(time) && typeof map[name][time] !== 'number') {
    map[name][time][0]++;
    map[name][time][1] += value;
  } else {
    map[name][time] = [1, value];
  }
  return map;
}

function countAggregator(map, name, time, value) {
  if (map[name].hasOwnProperty(time)) {
    map[name][time]++;
  } else {
    map[name][time] = 1;
  }
  return map;
}

// These serializer functions are for putting point data into a format to be read by the
// charting components
function getSerializer(serializerName) {
  switch (serializerName) {
    case 'avg':
      return avgSerializer;
    default:
      return defaultSerializer;
  }
}

function avgSerializer(key, val) {
  let newVal = val === 0 || val[0] === 0 ? 0 : (val[1] / val[0]);
  return [key, newVal];
}

function defaultSerializer(key, val) {
  return [key, val];
}
