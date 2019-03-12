import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build-minutes', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server.create('user');
  });

  test('it renders', async function (assert) {
    this.set('interval', 'week');
    this.set('private', true);
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    this.server.createList('insight-metric', 5);

    await render(hbs`{{build-minutes interval=interval owner=ownerData private=private}}`);
    await settled();

    assert.dom('.insights-glance').doesNotHaveClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Total Build Minutes');
    assert.dom('.insights-glance__stat').hasText('5 mins');
    assert.dom('.insights-glance__chart .chart-component').exists();
  });

  test('loading state renders', async function (assert) {
    this.set('interval', 'week');
    this.set('private', true);
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    render(hbs`{{build-minutes interval=interval owner=ownerData private=private}}`);
    await waitFor('.insights-glance--loading');

    assert.dom('.insights-glance').hasClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Total Build Minutes');
    assert.dom('.insights-glance__stat').hasText('');
    assert.dom('.insights-glance__chart .chart-component').doesNotExist();
    assert.dom('.insights-glance__chart-placeholder').exists();
  });
});
