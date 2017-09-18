import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('owner-not-found', 'Integration | Component | owner not found', {
  integration: true
});

test('it renders', function (assert) {
  this.render(hbs`{{owner-not-found ownerLogin="foo"}}`);

  assert.equal(this.$().find('.barricade').length, 1, 'renders the barricade svg');
  assert.equal(this.$().find('.page-title').text().trim(), 'We couldn\'t find the owner foo', 'displays the login of the owner');
});
