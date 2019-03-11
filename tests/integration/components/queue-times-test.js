import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | queue-times', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server.create('user');
  });

  test('stats exist', async function (assert) {
    this.set('interval', 'month');
    this.set('private', true);
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    this.server.createList('insight-metric', 15);

    await render(hbs`{{queue-times interval=interval owner=ownerData private=private}}`);
    await settled();

    assert.dom('.insights-glance').doesNotHaveClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Average Queue Time');
    assert.dom('.insights-glance__stat').hasText('0.6 mins');
    assert.dom('.insights-glance-delta').hasAttribute('data-dir', '-');
    assert.dom('.insights-glance-delta').hasAttribute('title', 'Averaged 1 min the previous month');
    assert.dom('.insights-glance-delta__stat').hasText('40%');
    assert.dom('.insights-glance__chart .highcharts-wrapper').exists();
  });

  test('loading state renders', async function (assert) {
    this.set('interval', 'week');
    this.set('private', true);
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    render(hbs`{{queue-times interval=interval owner=ownerData private=private}}`);
    await waitFor('.insights-glance--loading');

    assert.dom('.insights-glance').hasClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Average Queue Time');
    assert.dom('.insights-glance__stat').hasText('');
    assert.dom('.insights-glance__chart .highcharts-wrapper').doesNotExist();
    assert.dom('.insights-glance__chart-placeholder').exists();
  });
});
