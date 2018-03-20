import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:obfuscated-chars', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns obfuscated chars of length passed', async function(assert) {
    this.set('inputValue', 12);

    await render(hbs`{{obfuscated-chars inputValue}}`);

    assert.equal(this.$().text().trim(), '••••••••••••');
  });
});