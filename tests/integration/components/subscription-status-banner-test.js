import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | subscription status banner', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(
      hbs`{{subscription-status-banner color='green' message='Ohai' billingLinkText='Click' billingUrl='lol'}}`
    );

    assert.dom('.notice-banner--green').exists('it generates the correct class name');
    assert.dom('p').hasText('Ohai Click', 'it renders correct message and link text');
    assert.dom('a').hasAttribute('href', 'lol', 'it renders the correct href');
  });
});
