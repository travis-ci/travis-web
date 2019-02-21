import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | insight-tabs', function (hooks) {
  setupRenderingTest(hooks);

  test('month active by default', async function (assert) {
    await render(hbs`{{insight-tabs}}`);

    assert.dom('.insight-tabs').exists();
    assert.dom('.insight-tabs .insight-tab').exists({ count: 2 });
    assert.dom('.insight-tabs .insight-tab.active').exists({ count: 1 });
    assert.dom('.insight-tabs .insight-tab.active').hasText('Month');
  });

  test('week active', async function (assert) {
    this.set('interval', 'week');

    await render(hbs`{{insight-tabs selectedTab=interval}}`);

    assert.dom('.insight-tabs').exists();
    assert.dom('.insight-tabs .insight-tab').exists({ count: 2 });
    assert.dom('.insight-tabs .insight-tab.active').exists({ count: 1 });
    assert.dom('.insight-tabs .insight-tab.active').hasText('Week');
  });

  test('day active', async function (assert) {
    this.set('interval', 'day');

    await render(hbs`{{insight-tabs selectedTab=interval}}`);

    assert.dom('.insight-tabs').exists();
    assert.dom('.insight-tabs .insight-tab').exists({ count: 2 });
    assert.dom('.insight-tabs .insight-tab.active').doesNotExist();
  });
});
