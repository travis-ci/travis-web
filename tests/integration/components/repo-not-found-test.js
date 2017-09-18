import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('repo-not-found', 'Integration | Component | not found', {
  integration: true
});

test('it renders', function (assert) {
  let slug = 'some-org/some-repo';
  this.set('slug', slug);

  this.render(hbs`{{repo-not-found slug=slug}}`);

  assert.equal(this.$().find('.barricade').length, 1, 'renders the barricade svg');
  assert.equal(this.$().find('.page-title').text().trim(), 'We couldn\'t find the repository some-org/some-repo', 'displays the name of the not found repo');
});
