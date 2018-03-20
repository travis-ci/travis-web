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

    assert.ok(this.$().find('p').hasClass('notice-banner--green'), 'it generates the correct class name');
    assert.equal(this.$().text().trim(), 'Ohai Click', 'it renders correct message and link text');
    assert.equal(this.$().find('a').attr('href'), 'lol', 'it renders the correct href');
  });
});
