import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | oss usage numbers', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders correct images', async function (assert) {
    this.set('numbers', 1000);
    await render(hbs`{{oss-usage-numbers numbers=this.numbers}}`);

    assert.dom('img').exists({ count: 4 }, 'renders image for each digit');
  });
});
