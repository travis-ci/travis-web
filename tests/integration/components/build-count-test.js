import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build-count', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server.create('user');
  });

  test('it renders', async function (assert) {
    this.set('interval', 'month');
    this.set('ownerData', {
      '@type': 'User',
      id: 1,
    });

    await render(hbs`{{build-count interval=interval owner=ownerData}}`);

    await settled();

    // console.log('RES', this.element);
    assert.dom('.insights-glance__title').hasText('Builds');
    assert.dom('.insights-glance__stat').hasAnyText();
  });
});
