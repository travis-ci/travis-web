import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build-count', function (hooks) {
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

    await render(hbs`{{build-count interval=interval owner=ownerData}}`);
    await settled();

    const total = this.metricData.reduce((acc, metric) => acc + metric.value, 0);

    assert.dom('.insights-glance').doesNotHaveClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Builds');
    assert.dom('.insights-glance__stat').hasText(`${total}`);
    assert.dom('.insights-glance__chart .highcharts-wrapper').exists();
  });

  test('it renders when data is not found', async function (assert) {
    this.set('interval', 'week');
    this.set('ownerData', {
      '@type': 'User',
      id: -1,
    });

    await render(hbs`{{build-count interval=interval owner=ownerData}}`);
    await settled();

    assert.dom('.insights-glance').hasClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Builds');
    assert.dom('.insights-glance__stat').hasText('\xa0');
    assert.dom('.insights-glance__chart .highcharts-wrapper').doesNotExist();
    assert.dom('.insights-glance__chart-placeholder').exists();
  });
});
