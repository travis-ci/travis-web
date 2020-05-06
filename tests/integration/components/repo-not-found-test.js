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

    assert.dom('.barricade').exists('renders the barricade svg');
    assert.dom('.page-title').hasText('We couldn\'t display the repository some-org/some-repo', 'displays the name of the not found repo');
  });
});
