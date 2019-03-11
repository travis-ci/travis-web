import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build-status-chart', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server.createList('user', 2);
  });

  test('it renders', async function (assert) {
    this.set('interval', 'week');
    this.set('private', true);
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    this.server.createList('insight-metric', 5);

    await render(hbs`{{build-status-chart interval=interval owner=ownerData private=private}}`);
    await settled();

    assert.dom('.insights-odyssey').doesNotHaveClass('insights-odyssey--loading');
    assert.dom('.insights-odyssey__title').hasText('Build Statuses');
    assert.dom('.insights-odyssey__chart .chart-component').exists();
  });

  test('loading state renders', async function (assert) {
    this.set('interval', 'week');
    this.set('private', true);
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    render(hbs`{{build-status-chart interval=interval owner=ownerData private=private}}`);
    await waitFor('.insights-odyssey--loading');

    assert.dom('.insights-odyssey').hasClass('insights-odyssey--loading');
    assert.dom('.insights-odyssey__title').hasText('Build Statuses');
    assert.dom('.insights-odyssey__chart .chart-component').doesNotExist();
  });

  test('it renders empty result message', async function (assert) {
    this.set('interval', 'week');
    this.set('private', true);
    this.set('ownerData', {
      '@type': 'User',
      id: 2,
    });

    await render(hbs`{{build-status-chart interval=interval owner=ownerData private=private}}`);
    await settled();

    assert.dom('.insights-odyssey').doesNotHaveClass('insights-odyssey--loading');
    assert.dom('.insights-odyssey__title').hasText('Build Statuses');
    assert.dom('.insights-odyssey__chart .chart-component').doesNotExist();
    assert.dom('.insights-odyssey__chart').containsText('No builds this week');
  });
});
