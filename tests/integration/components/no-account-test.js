import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | no account', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    let org = EmberObject.create({
      name: 'famous-org'
    });
    this.set('name', org);
    await render(hbs`{{no-account name=name.name}}`);

    assert.equal(this.$('.page-title').text().trim(), 'We couldn\'t find the organization famous-org');
  });
});
