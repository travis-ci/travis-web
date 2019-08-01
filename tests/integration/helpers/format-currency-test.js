import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | format-currency', function (hooks) {
  setupRenderingTest(hooks);

  test('it formats 100cents to $1.00', async function (assert) {
    this.set('inputValue', 100);

    await render(hbs`{{format-currency inputValue}}`);

    assert.equal(this.element.textContent.trim(), '$1.00');
  });

  test('it formats 0cents to $0.00', async function (assert) {
    this.set('inputValue', 0);

    await render(hbs`{{format-currency inputValue}}`);

    assert.equal(this.element.textContent.trim(), '$0.00');
  });

  test('it formats 154cents to $1.54', async function (assert) {
    this.set('inputValue', 154);

    await render(hbs`{{format-currency inputValue}}`);

    assert.equal(this.element.textContent.trim(), '$1.54');
  });

  test('it formats 100cents to $1', async function (assert) {
    this.set('inputValue', 1500);
    this.set('floor', true);

    await render(hbs`{{format-currency inputValue floor=floor}}`);

    assert.equal(this.element.textContent.trim(), '$15');
  });
});
