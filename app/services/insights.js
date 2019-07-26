import Service, { inject as service } from '@ember/service';
import moment from 'moment';
import { assign } from '@ember/polyfills';
import { task } from 'ember-concurrency';
import { singularize } from 'ember-inflector';

export const INSIGHTS_INTERVALS = {
  WEEK: 'week',
  MONTH: 'month',
};
export const DEFAULT_INSIGHTS_INTERVAL = INSIGHTS_INTERVALS.MONTH;

const defaultIntervalSettings = {
  day: {
    subInterval: '10min',
    instanceLabel: 'today',
    prevInstanceLabel: 'yesterday',
  },
  week: {
    subInterval: '1day',
    instanceLabel: 'this week',
    prevInstanceLabel: 'last week',
  },
  month: {
    subInterval: '1day',
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
    const settings =  Object.values(INSIGHTS_INTERVALS).reduce((settings, interval) => {
      settings[interval] = {};
      assign(settings[interval], defaultIntervalSettings[interval], customIntervalSettings[interval]);
      return settings;
    }, {});
    return settings;
  },

  // In this context, a negative value for startInterval or endInterval indicates a date in the past. Think of it as the number of `interval`s
  // that should be added to the current date to arrive at the start/end of the time period you would like to look at.
  getDatesFromInterval(interval, startInterval = -1, endInterval = 0) {
    const startIntervalDays = convertIntervalToDays(interval, startInterval);
    const endIntervalDays = convertIntervalToDays(interval, endInterval);

    let start = moment.utc().add(startIntervalDays, 'day');
    let end = moment.utc().add(endIntervalDays, 'day');

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
    const { subInterval } = intervalSettings[interval];
    const { startInterval, endInterval, aggregator } = currentOptions;
    const [startTime, endTime] = this.getDatesFromInterval(interval, startInterval, endInterval);
    const apiSettings = getMetricAPISettings(subject, func, subInterval, metricNames, owner, startTime, endTime, currentOptions);

    /* Fetch metrics */
    let metrics = yield this.fetchMetrics.perform(apiSettings, currentOptions);
    const requestPrivate = metrics.data.private === 'true';

    /* Set labels */
    let labels = createLabels(startTime, endTime, subInterval);

    /* Prepare fetched metric data for charts */
    let data = aggregateMetrics(metricNames, metrics, aggregator, labels, subInterval);

    serializeMetrics(data, metricNames, currentOptions);

    labels = Object.keys(labels);

    return { data, private: requestPrivate, labels, metrics };
  }),

  fetchMetrics: task(function* (apiSettings) {
    return yield this.api.get(endpoints.metrics, apiSettings) || [];
  }),

  // Active Repo endpoint functions
  getActiveRepos(owner, interval, requestPrivate = false) {
    const [startTime, endTime] = this.getDatesFromInterval(interval);

    const apiSettings = {
      stringifyData: false,
      data: {
        owner_type: owner.isUser ? 'User' : 'Organization',
        owner_id: owner.id,
        end_time: endTime.format(apiTimeRequestFormat),
        start_time: startTime.format(apiTimeRequestFormat),
        private: requestPrivate,
      }
    };

    return this.fetchActiveRepos.perform(apiSettings);
  },

  fetchActiveRepos: task(function* (apiSettings) {
    return yield this.api.get(endpoints.activeRepos, apiSettings) || [];
  }),
});

// Metric preparation functions
function getMetricAPISettings(subject, func, subInterval, metricNames, owner, startTime, endTime, options) {
  return {
    stringifyData: false,
    data: {
      subject,
      interval: subInterval,
      func,
      name: metricNames.join(','),
      owner_type: owner.isUser ? 'User' : 'Organization',
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

// Currently, when displaying insights, we regard a "month" as a period of 30 days and a "week" as a period of 7 days.
function convertIntervalToDays(interval, amount) {
  return {
    month: 30 * amount,
    week: 7 * amount,
    day: amount,
  }[interval];
}

function getSubintervalDetails(subInterval) {
  return {
    '1min': {step: 1, intervalName: 'minutes', keyFormat: 'YYYY-MM-DD HH:mm'},
    '10min': {step: 10, intervalName: 'minutes', keyFormat: 'YYYY-MM-DD HH:mm'},
    '1hour': {step: 1, intervalName: 'hours', keyFormat: 'YYYY-MM-DD HH'},
    '1day': {step: 1, intervalName: 'days', keyFormat: 'YYYY-MM-DD'},
  }[subInterval];
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
  return {
    sum: sumAggregator,
    max: maxAggregator,
    avg: avgAggregator,
    count: countAggregator,
  }[aggName];
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
  const serializers = {
    avg: avgSerializer,
  };
  return serializers[serializerName] || defaultSerializer;
}

function avgSerializer(key, val) {
  let newVal = val === 0 || val[0] === 0 ? 0 : (val[1] / val[0]);
  return [key, newVal];
}

function defaultSerializer(key, val) {
  return [key, val];
}
