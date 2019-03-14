import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visibility-setting-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it is empty when no options are set', async function (assert) {
    await render(hbs`{{visibility-setting-list}}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
