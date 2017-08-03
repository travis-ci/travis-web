import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('not-found', 'Integration | Component | not found', {
  integration: true
});

test('it renders', function (assert) {
  let slug = 'some-org/some-repo';
  this.set('slug', slug);

  this.render(hbs`{{not-found slug=slug}}`);

  assert.ok(this.$().find('svg').hasClass('barricade'), 'renders the barricade svg');
  assert.equal(this.$().find('.page-title').text().trim(), 'We couldn\'t find the repository some-org/some-repo', 'displays the name of the not found repo');
});
