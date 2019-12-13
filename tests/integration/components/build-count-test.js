import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { INSIGHTS_INTERVALS } from 'travis/services/insights';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | build-count', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const user = this.server.create('user');
    this.setProperties({
      ownerData: user,
      private: true,
    });
  });

  test('builds stats', async function (assert) {
    this.set('interval', INSIGHTS_INTERVALS.MONTH);

    this.server.createList('insight-metric', 15);

    await render(hbs`{{build-count interval=interval owner=ownerData private=private}}`);
    await settled();

    assert.dom('.insights-glance').doesNotHaveClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Total Builds');
    assert.dom('.insights-glance__stat').hasText('448');
    assert.dom('.insights-glance-delta').hasAttribute('data-dir', '+');
    assert.dom('.insights-glance-delta').hasAttribute('title', '120 builds the previous month');
    assert.dom('.insights-glance-delta__stat').hasText('273.3%');
    assert.dom('.insights-glance__chart .chart-component').exists();
  });

  test('loading state renders', async function (assert) {
    this.set('interval', INSIGHTS_INTERVALS.WEEK);

    render(hbs`{{build-count interval=interval owner=ownerData private=private}}`);
    await waitFor('.insights-glance--loading');

    assert.dom('.insights-glance').hasClass('insights-glance--loading');
    assert.dom('.insights-glance__title').hasText('Total Builds');
    assert.dom('.insights-glance__stat').hasText('');
    assert.dom('.insights-glance-delta').doesNotExist();
    assert.dom('.insights-glance__chart .chart-component').doesNotExist();
    assert.dom('.insights-glance__chart-placeholder').exists();
  });
});
