import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { INSIGHTS_INTERVALS } from 'travis/services/insights';

module('Integration | Component | insights-tabs', function (hooks) {
  setupRenderingTest(hooks);

  test('display', async function (assert) {
    await render(hbs`{{insights-tabs}}`);

    assert.dom('.insights-tabs').exists();
    assert.dom('.insights-tabs .insights-tab').exists({ count: Object.values(INSIGHTS_INTERVALS).length });
  });
});
