import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | insights-glance', function (hooks) {
  setupRenderingTest(hooks);

  test('loading state renders', async function (assert) {
    this.set('isLoading', true);

    await render(hbs`{{insights-glance isLoading=isLoading}}`);
    assert.dom('.insights-glance').hasClass('insights-glance--loading');
    assert.dom('.insights-glance__stat').hasText('');
    assert.dom('.insights-glance__chart .chart-component').doesNotExist();
  });

  test('loaded state renders', async function (assert) {
    this.setProperties({
      title: 'Test title',
      isLoading: false,
      statistic: 100,
      isEmpty: false,
    });

    await render(hbs`{{insights-glance isLoading=isLoading statistic=statistic isEmpty=isEmpty title=title}}`);

    assert.dom('.insights-glance__title').hasText('Test title');
    assert.dom('.insights-glance__stat').hasText('100');
    assert.dom('.insights-glance__chart .chart-component').exists();
  });

  test('delta section renders', async function (assert) {
    this.set('delta', 5);
    this.set('deltaTitle', 'Test 1');
    this.set('deltaText', 'Test 2');

    await render(hbs`{{insights-glance delta=delta deltaTitle=deltaTitle deltaText=deltaText}}`);
    assert.dom('.insights-glance-delta').hasAttribute('data-dir', '+');
    assert.dom('.insights-glance-delta').hasAttribute('title', 'Test 1');
    assert.dom('.insights-glance-delta__stat').hasText('Test 2');
  });
});
