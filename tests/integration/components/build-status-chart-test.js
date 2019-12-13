import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { INSIGHTS_INTERVALS } from 'travis/services/insights';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | build-status-chart', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const [user1, user2] = this.server.createList('user', 2);
    this.setProperties({
      user1,
      user2,
      private: true,
      interval: INSIGHTS_INTERVALS.WEEK,
    });
  });

  test('it renders', async function (assert) {
    this.server.createList('insight-metric', 5);

    await render(hbs`{{build-status-chart interval=interval owner=user1 private=private}}`);
    await settled();

    assert.dom('.insights-odyssey').doesNotHaveClass('insights-odyssey--loading');
    assert.dom('.insights-odyssey__title').hasText('Build Statuses');
    assert.dom('.insights-odyssey__chart .chart-component').exists();
  });

  test('loading state renders', async function (assert) {
    render(hbs`{{build-status-chart interval=interval owner=user1 private=private}}`);
    await waitFor('.insights-odyssey--loading');

    assert.dom('.insights-odyssey').hasClass('insights-odyssey--loading');
    assert.dom('.insights-odyssey__title').hasText('Build Statuses');
    assert.dom('.insights-odyssey__chart .chart-component').doesNotExist();
  });

  test('it renders empty result message', async function (assert) {
    await render(hbs`{{build-status-chart interval=interval owner=user2 private=private}}`);
    await settled();

    assert.dom('.insights-odyssey').doesNotHaveClass('insights-odyssey--loading');
    assert.dom('.insights-odyssey__title').hasText('Build Statuses');
    assert.dom('.insights-odyssey__chart .chart-component').doesNotExist();
    assert.dom('.insights-odyssey__chart').containsText('No builds this week');
  });
});
