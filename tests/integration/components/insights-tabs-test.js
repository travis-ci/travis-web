import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | insights-tabs', function (hooks) {
  setupRenderingTest(hooks);

  test('month active by default', async function (assert) {
    await render(hbs`{{insights-tabs}}`);

    assert.dom('.insights-tabs').exists();
    assert.dom('.insights-tabs .insights-tab').exists({ count: 2 });
    assert.dom('.insights-tabs .insights-tab.active').exists({ count: 1 });
    assert.dom('.insights-tabs .insights-tab.active').hasText('Month');
  });

  test('week active', async function (assert) {
    this.set('interval', 'week');

    await render(hbs`{{insights-tabs selectedTab=interval}}`);

    assert.dom('.insights-tabs').exists();
    assert.dom('.insights-tabs .insights-tab').exists({ count: 2 });
    assert.dom('.insights-tabs .insights-tab.active').exists({ count: 1 });
    assert.dom('.insights-tabs .insights-tab.active').hasText('Week');
  });

  test('day active', async function (assert) {
    this.set('interval', 'day');

    await render(hbs`{{insights-tabs selectedTab=interval}}`);

    assert.dom('.insights-tabs').exists();
    assert.dom('.insights-tabs .insights-tab').exists({ count: 2 });
    assert.dom('.insights-tabs .insights-tab.active').doesNotExist();
  });
});
