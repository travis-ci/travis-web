import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build-count', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server.create('user');
  });

  test('builds stats', async function (assert) {
    this.set('interval', 'month');
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    this.server.createList('insight-metric', 15);

    await render(hbs`{{build-count interval=interval owner=ownerData}}`);
    await settled();

    assert.dom('.insights-glance').doesNotHaveClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Builds');
    assert.dom('.insights-glance__stat').hasText('448');
    assert.dom('.insights-glance-delta').hasAttribute('data-dir', '+');
    assert.dom('.insights-glance-delta').hasAttribute('title', '120 builds the previous month');
    assert.dom('.insights-glance-delta__stat').hasText('273.3%');
    assert.dom('.insights-glance__chart .highcharts-wrapper').exists();
  });

  test('no owner', async function (assert) {
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
    assert.dom('.insights-glance-delta').doesNotExist();
    assert.dom('.insights-glance__chart .highcharts-wrapper').doesNotExist();
    assert.dom('.insights-glance__chart-placeholder').exists();
  });
});
