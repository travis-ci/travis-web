import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | insights', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.insightsService = this.owner.lookup('service:insights');
  });

  test('default interval settings', function (assert) {
    let intervalSettings = this.insightsService.getIntervalSettings({ day: {subInterval: '1min'} });
    let intervalSettings2 = this.insightsService.getIntervalSettings();
    intervalSettings2.day.subInterval = '1min';

    assert.ok(this.insightsService);
    assert.deepEqual(intervalSettings, intervalSettings2);
  });

  test('dates from interval', function (assert) {
    let serviceDates = this.insightsService.getDatesFromInterval('day');

    assert.equal(Array.isArray(serviceDates), true);
    assert.equal(serviceDates.length, 2);

    let [start, end] = serviceDates;
    assert.equal(start < end, true);

    let day = (1000 * 60 * 60 * 24);
    let sDay = (end - start);
    let diff = day - sDay;
    assert.equal(diff <= 1 && diff >= -1, true);
  });

  test('aggregators', function (assert) {
    let aggregator, result;

    // Default - (map, name, time, value)
    aggregator = this.insightsService._getAggregator();
    result = aggregator({test: {}}, 'test', 10, 20);
    assert.deepEqual(result, {test: {}});

    // Sum
    aggregator = this.insightsService._getAggregator('sum');
    result = aggregator({test: {}}, 'test', 10, 20);
    assert.deepEqual(result, {test: {'10': 20}});

    result = aggregator({test: {'10': 20}}, 'test', 10, 20);
    assert.deepEqual(result, {test: {'10': 40}});

    // Max
    aggregator = this.insightsService._getAggregator('max');
    result = aggregator({test: {}}, 'test', 10, 20);
    assert.deepEqual(result, {test: {'10': 20}});

    result = aggregator({test: {'10': 20}}, 'test', 10, 25);
    assert.deepEqual(result, {test: {'10': 25}});

    // Avg
    aggregator = this.insightsService._getAggregator('avg');
    result = aggregator({test: {}}, 'test', 10, 20);
    assert.deepEqual(result, {test: {'10': [1, 20]}});

    result = aggregator({test: {'10': [1, 20]}}, 'test', 10, 40);
    assert.deepEqual(result, {test: {'10': [2, 60]}});

    // Count
    aggregator = this.insightsService._getAggregator('count');
    result = aggregator({test: {}}, 'test', 10, 20);
    assert.deepEqual(result, {test: {'10': 1}});

    result = aggregator({test: {'10': 1}}, 'test', 10, 20);
    assert.deepEqual(result, {test: {'10': 2}});
  });

  test('transformers', function (assert) {
    let transformer, result;

    // Default
    transformer = this.insightsService._getTransformer();
    result = transformer('10', 20);
    assert.deepEqual(result, [10, 20]);

    // Avg
    transformer = this.insightsService._getTransformer('avg');
    result = transformer('10', [5, 20]);
    assert.deepEqual(result, [10, 4]);
  });

  test('active repos with no metric data', async function (assert) {
    this.server.create('user');

    let result = await this.insightsService.getActiveRepos({id: 1, '@type': 'user'});
    assert.equal(result.data.count, 0);
  });

  test('active repos', async function (assert) {
    this.server.create('user');
    server.createList('insight-metric', 1);

    let result = await this.insightsService.getActiveRepos({id: 1, '@type': 'user'});
    assert.equal(result.data.count, 75);
  });

  test('getMetric with no metric data', async function (assert) {
    this.server.create('user');

    // Test no metric data scenario
    let empty = {
      data: {
        count_created: {
          chartData: [],
        },
      },
    };

    let result = await this.insightsService.getMetric(
      {id: 1, '@type': 'user'},
      'week',
      'jobs',
      'sum',
      ['count_created']
    );
    assert.deepEqual(result, empty);
  });

  test('metric sum', async function (assert) {
    this.server.create('user');
    server.createList('insight-metric', 5);
    const metricName = 'count_started';

    let result = await this.insightsService.getMetric(
      {id: 1, '@type': 'user'},
      'week',
      'builds',
      'sum',
      [metricName]
    );
    assert.equal(result.data.hasOwnProperty(metricName), true);
    assert.equal(result.data[metricName].chartData.length, 4);
    let total = result.data[metricName].chartData.reduce((acc, val) => acc + val[1], 0);
    assert.equal(total, 300);
  });

  test('metric max', async function (assert) {
    this.server.create('user');
    server.createList('insight-metric', 10);
    const metricName = 'count_finished';

    let result = await this.insightsService.getMetric(
      {id: 1, '@type': 'user'},
      'week',
      'builds',
      'max',
      [metricName]
    );
    assert.equal(result.data.hasOwnProperty(metricName), true);
    assert.equal(result.data[metricName].chartData.length, 4);
    let total = result.data[metricName].chartData.reduce((acc, val) => acc + val[1], 0);
    assert.equal(total, 260);
  });

  test('metric avg', async function (assert) {
    this.server.create('user');
    server.createList('insight-metric', 10);
    const metricName = 'count_passed';

    let result = await this.insightsService.getMetric(
      {id: 1, '@type': 'user'},
      'week',
      'builds',
      'avg',
      [metricName]
    );
    assert.equal(result.data.hasOwnProperty(metricName), true);
    assert.equal(result.data[metricName].chartData.length, 4);
    let total = result.data[metricName].chartData.reduce((acc, val) => acc + val[1], 0);
    let avg = Math.round((total / result.data[metricName].chartData.length) * 100) / 100;
    assert.equal(total, 250);
    assert.equal(avg, 62.5);
  });

  test('metric count', async function (assert) {
    this.server.create('user');
    server.createList('insight-metric', 10);
    const metricName = 'count_failed';

    let result = await this.insightsService.getMetric(
      {id: 1, '@type': 'user'},
      'week',
      'builds',
      'count',
      [metricName]
    );
    assert.equal(result.data.hasOwnProperty(metricName), true);
    assert.equal(result.data[metricName].chartData.length, 4);
    let total = result.data[metricName].chartData.reduce((acc, val) => acc + val[1], 0);
    assert.equal(total, 5);
  });
});
