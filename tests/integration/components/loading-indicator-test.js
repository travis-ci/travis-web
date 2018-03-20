import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | loading indicator', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('center', true);

    await render(hbs`{{loading-indicator center=center}}`);

    assert.ok(this.$('span').hasClass('loading-indicator'), 'component has loading indicator class');
    assert.ok(this.$('div').hasClass('loading-container'), 'indicator gets parent class if centered flag is given');
  });
});