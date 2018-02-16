import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('obfuscated-chars', 'helper:obfuscated-chars', {
  integration: true
});

test('it returns obfuscated chars of length passed', function (assert) {
  this.set('inputValue', 12);

  this.render(hbs`{{obfuscated-chars inputValue}}`);

  assert.equal(this.$().text().trim(), '••••••••••••');
});
