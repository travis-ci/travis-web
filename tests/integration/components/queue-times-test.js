import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | queue-times', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server.create('user');
  });

  test('it renders', async function (assert) {
    this.set('interval', 'week');
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    // Right now just this one test uses this data. If more tests need it in the future, move to hooks.beforeEach
    this.metricData = this.server.createList('insight-metric', 5);
    this.metricTotal = (this.metricData.reduce((acc, metric) => acc + (Math.round((metric.value / 60) * 100) / 100), 0));
    this.metricAvg = (Math.round((this.metricTotal / this.metricData.length) * 100) / 100);

    await render(hbs`{{queue-times interval=interval owner=ownerData}}`);
    await settled();

    assert.dom('.insights-glance').doesNotHaveClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Average Queue Time');
    assert.dom('.insights-glance__stat').hasText(`${this.metricAvg} mins`);
    assert.dom('.insights-glance__chart .highcharts-wrapper').exists();
  });

  test('it renders when data is not found', async function (assert) {
    this.set('interval', 'week');
    this.set('ownerData', {
      '@type': 'User',
      id: -1,
    });

    await render(hbs`{{queue-times interval=interval owner=ownerData}}`);
    await settled();

    assert.dom('.insights-glance').hasClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Average Queue Time');
    assert.dom('.insights-glance__stat').hasText('\xa0');
    assert.dom('.insights-glance__chart .highcharts-wrapper').doesNotExist();
    assert.dom('.insights-glance__chart-placeholder').exists();
  });
});
