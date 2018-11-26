import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build-count', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('interval', 'month');
    this.set('ownerData', {
      '@type': 'Organization',
      id: 87,
    });

    await render(hbs`{{build-count interval=interval owner=ownerData}}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
