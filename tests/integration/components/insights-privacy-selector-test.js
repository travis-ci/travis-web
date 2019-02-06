import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | insights-privacy-selector', function (hooks) {
  setupRenderingTest(hooks);

  test('only public available', async function (assert) {
    this.set('isPrivateInsightsViewable', false);

    await render(hbs`{{insights-privacy-selector isPrivateInsightsViewable=isPrivateInsightsViewable}}`);

    assert.equal(this.element.textContent.trim(), 'Insights:\n  public builds');
  });
});
