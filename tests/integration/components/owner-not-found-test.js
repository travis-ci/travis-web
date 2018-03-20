import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | owner not found', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{owner-not-found ownerLogin="foo"}}`);

    assert.equal(this.$().find('.barricade').length, 1, 'renders the barricade svg');
    assert.equal(this.$().find('.page-title').text().trim(), 'We couldn\'t find the owner foo', 'displays the login of the owner');
  });
});
