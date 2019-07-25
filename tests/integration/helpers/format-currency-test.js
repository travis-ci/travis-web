import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | format-currency', function (hooks) {
  setupRenderingTest(hooks);

  test('it formats 100cents to $1', async function (assert) {
    this.set('inputValue', 100);

    await render(hbs`{{format-currency inputValue}}`);

    assert.equal(this.element.textContent.trim(), '$1');
  });
});
