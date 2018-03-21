import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | owner not found', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{owner-not-found ownerLogin="foo"}}`);

    assert.dom('.barricade').exists('renders the barricade svg');
    assert.dom('.page-title').hasText('We couldn\'t find the owner foo', 'displays the login of the owner');
  });
});
