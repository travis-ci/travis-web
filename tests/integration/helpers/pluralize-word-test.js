import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | pluralize-word', function (hooks) {
  setupRenderingTest(hooks);

  test('it pluralizes value with 1 to singular', async function (assert) {
    this.set('inputValue', 1);
    this.set('singular', 'job');
    this.set('plural', 'jobs');

    await render(hbs`{{pluralize-word inputValue singular plural}}`);

    assert.equal(this.element.textContent.trim(), 'job');
  });

  test('it pluralizes value greater than 1 to plural', async function (assert) {
    this.set('inputValue', 2);
    this.set('singular', 'job');
    this.set('plural', 'jobs');

    await render(hbs`{{pluralize-word inputValue singular plural}}`);

    assert.equal(this.element.textContent.trim(), 'jobs');
  });
});
