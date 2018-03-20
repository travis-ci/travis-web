import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | not found', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    let slug = 'some-org/some-repo';
    this.set('slug', slug);

    await render(hbs`{{repo-not-found slug=slug}}`);

    assert.equal(this.$().find('.barricade').length, 1, 'renders the barricade svg');
    assert.equal(this.$().find('.page-title').text().trim(), 'We couldn\'t find the repository some-org/some-repo', 'displays the name of the not found repo');
  });
});
