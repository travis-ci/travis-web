import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | insights', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.insightsService = this.owner.lookup('service:insights');
  });

  test('default interval settings', function (assert) {
    let intervalSettings = this.insightsService.getIntervalSettings({ week: {subInterval: '1min'} });
    let intervalSettings2 = this.insightsService.getIntervalSettings();
    intervalSettings2.week.subInterval = '1min';

    assert.ok(this.insightsService);
    assert.deepEqual(intervalSettings, intervalSettings2);
  });

  test('dates from interval', function (assert) {
    let serviceDates = this.insightsService.getDatesFromInterval('week');

    assert.equal(Array.isArray(serviceDates), true);
    assert.equal(serviceDates.length, 2);

    let [start, end] = serviceDates;
    assert.equal(start < end, true);

    let week = (1000 * 60 * 60 * 24 * 7);
    let serviceDatesDifference = (end - start);
    let diff = week - serviceDatesDifference;
    assert.equal(diff <= 1 && diff >= -1, true);
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
      private: false,
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

  test('metric options', async function (assert) {
    this.server.create('user');
    server.createList('insight-metric', 10);
    const metricNames = ['test', 'example'];

    let result = await this.insightsService.getMetric(
      {id: 1, '@type': 'user'},
      'week',
      'builds',
      'sum',
      metricNames,
      {
        calcTotal: true,
        calcAvg: true,
        // A common custom transform is to convert seconds to minutes
        customTransform: (key, val) => [key, Math.round(val / 60)],
      }
    );

    metricNames.map(metric => {
      assert.equal(result.data.hasOwnProperty(metric), true);
      assert.equal(result.data[metric].chartData.length, 4);
      let total = result.data[metric].chartData.reduce((acc, val) => acc + val[1], 0);
      let avg = Math.round((total / result.data[metric].chartData.length) * 100) / 100;
      assert.equal(total, result.data[metric].total);
      assert.equal(avg, result.data[metric].average);
    });
    assert.equal(result.data['test'].total, 5);
    assert.equal(result.data['test'].average, 1.25);
  });
});
