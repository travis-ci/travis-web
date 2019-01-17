import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | active-repo-count', function (hooks) {
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

    server.createList('insight-metric', 1);

    await render(hbs`{{active-repo-count interval=interval owner=ownerData}}`);
    await settled();

    assert.dom('.insights-glance').doesNotHaveClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Active Repositories');
    assert.dom('.insights-glance__stat').hasText('75');
    assert.dom('.insights-glance__chart .highcharts-wrapper').exists();
  });

  test('it renders when data is not found', async function (assert) {
    this.set('interval', 'week');
    this.set('ownerData', {
      '@type': 'User',
      id: -1,
    });

    await render(hbs`{{active-repo-count interval=interval owner=ownerData}}`);
    await settled();

    assert.dom('.insights-glance').hasClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Active Repositories');
    assert.dom('.insights-glance__stat').hasText('');
    assert.dom('.insights-glance__chart .highcharts-wrapper').doesNotExist();
    assert.dom('.insights-glance__chart-placeholder').exists();
  });
});
