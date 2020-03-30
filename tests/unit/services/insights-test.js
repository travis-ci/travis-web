import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Service | insights', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

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

    let day = 1000 * 60 * 60 * 24;
    let week = day * 7;
    let serviceDatesDifference = (end - start);
    let diff = week - serviceDatesDifference;
    assert.ok(diff <= day && diff >= (day * -1));
  });

  test('active repos with no metric data', async function (assert) {
    const user = this.server.create('user');

    let result = await this.insightsService.getActiveRepos(user, 'week');
    assert.equal(result.data.count, 0);
  });

  test('active repos', async function (assert) {
    const user = this.server.create('user');
    this.server.createList('insight-metric', 1);

    let result = await this.insightsService.getActiveRepos(user, 'week');
    assert.equal(result.data.count, 75);
  });

  test('getChartData with no metric data', async function (assert) {
    const user = this.server.create('user');

    let result = await this.insightsService.getChartData.perform(
      user,
      'week',
      'jobs',
      'sum',
      ['count_created']
    );
    assert.equal(result.data.total, 0);
    assert.notOk(result.private);
    assert.ok(result.data.hasOwnProperty('count_created'));
  });

  test('metric sum', async function (assert) {
    const user = this.server.create('user');
    this.server.createList('insight-metric', 5);
    const metricName = 'count_started';

    let result = await this.insightsService.getChartData.perform(
      user,
      'week',
      'builds',
      'sum',
      [metricName]
    );
    assert.ok(result.data.hasOwnProperty(metricName));
    assert.equal(result.data[metricName].plotData.length, 7);
    assert.equal(result.data.total, 300);
  });

  test('metric max', async function (assert) {
    const user = this.server.create('user');
    this.server.createList('insight-metric', 10);
    const metricName = 'count_finished';

    let result = await this.insightsService.getChartData.perform(
      user,
      'week',
      'builds',
      'max',
      [metricName]
    );
    assert.ok(result.data.hasOwnProperty(metricName));
    assert.equal(result.data[metricName].plotData.length, 7);
    assert.equal(result.data.total, 260);
  });

  test('metric avg', async function (assert) {
    const user = this.server.create('user');
    this.server.createList('insight-metric', 10);
    const metricName = 'count_passed';

    let result = await this.insightsService.getChartData.perform(
      user,
      'week',
      'builds',
      'avg',
      [metricName],
      { calcAvg: true }
    );

    assert.ok(result.data.hasOwnProperty(metricName));
    assert.equal(result.data[metricName].plotData.length, 7);
    assert.equal(result.data.total, 250);
    assert.equal(result.data.average, 62.5);
  });

  test('metric count', async function (assert) {
    const user = this.server.create('user');
    this.server.createList('insight-metric', 10);
    const metricName = 'count_failed';

    let result = await this.insightsService.getChartData.perform(
      user,
      'week',
      'builds',
      'count',
      [metricName]
    );
    assert.ok(result.data.hasOwnProperty(metricName));
    assert.equal(result.data[metricName].plotData.length, 7);
    assert.equal(result.data.total, 5);
  });

  test('metric options', async function (assert) {
    const user = this.server.create('user');
    this.server.createList('insight-metric', 10);
    const metricNames = ['test', 'example'];

    let result = await this.insightsService.getChartData.perform(
      user,
      'week',
      'builds',
      'sum',
      metricNames,
      {
        calcAvg: true,
        // A common custom transform is to convert seconds to minutes
        customSerialize: (key, val) => [key, Math.round(val / 60)],
      }
    );

    metricNames.map(metric => {
      assert.equal(result.data.hasOwnProperty(metric), true);
      assert.equal(result.data[metric].plotData.length, 7);
      let total = result.data[metric].plotValues.reduce((acc, val) => acc + val, 0);
      let filtered = result.data[metric].plotValues.filter(val => val !== 0);
      let avg = total / filtered.length;
      assert.equal(result.data[metric].total, total);
      assert.equal(result.data[metric].average, avg);
    });
  });
});
