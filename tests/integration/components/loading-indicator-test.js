import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | loading indicator', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('center', true);

    await render(hbs`{{loading-indicator center=this.center}}`);

    assert.dom('span').hasClass('loading-indicator', 'component has loading indicator class');
    assert.dom('div.loading-container').exists('indicator gets parent class if centered flag is given');
  });
});
