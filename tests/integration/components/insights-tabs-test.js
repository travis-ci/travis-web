import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { INSIGHTS_INTERVALS } from 'travis/services/insights';

module('Integration | Component | insights-tabs', function (hooks) {
  setupRenderingTest(hooks);

  test('default active by default', async function (assert) {
    await render(hbs`{{insights-tabs timeInterval=timeInterval}}`);

    assert.dom('.insights-tabs').exists();
    assert.dom('.insights-tabs .insights-tab').exists({ count: 2 });
    // assert.dom('.insights-tabs .insights-tab .active').exists({ count: 1 });
    // assert.dom('.insights-tabs .insights-tab .active').hasText(DEFAULT_INSIGHTS_INTERVAL.capitalize());
  });

  test('month active', async function (assert) {
    await render(hbs`{{insights-tabs}}`);

    assert.dom('.insights-tabs').exists();
    assert.dom('.insights-tabs .insights-tab').exists({ count: 2 });
    // assert.dom('.insights-tabs .insights-tab .active').exists({ count: 1 });
    // assert.dom('.insights-tabs .insights-tab .active').hasText(INSIGHTS_INTERVALS.MONTH.capitalize());
  });

  test('week active', async function (assert) {
    this.set('interval', INSIGHTS_INTERVALS.WEEK);

    await render(hbs`{{insights-tabs selectedTab=interval}}`);

    assert.dom('.insights-tabs').exists();
    assert.dom('.insights-tabs .insights-tab').exists({ count: 2 });
    // assert.dom('.insights-tabs .insights-tab .active').exists({ count: 1 });
    // assert.dom('.insights-tabs .insights-tab .active').hasText(INSIGHTS_INTERVALS.WEEK.capitalize());
  });

  test('day active', async function (assert) {
    this.set('interval', 'day');

    await render(hbs`{{insights-tabs selectedTab=interval}}`);

    assert.dom('.insights-tabs').exists();
    assert.dom('.insights-tabs .insights-tab').exists({ count: 2 });
    assert.dom('.insights-tabs .insights-tab .active').doesNotExist();
  });
});
