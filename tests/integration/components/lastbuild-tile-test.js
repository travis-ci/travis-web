import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | lastbuild tile', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    let build = {
      state: 'passed',
      id: 1234,
      number: '222'
    };
    this.set('build', build);

    await render(hbs`{{lastbuild-tile build=build}}`);

    assert.equal(this.$('.label-align').text().trim(), '#222', 'shows the right build number');
    assert.equal(this.$('li').hasClass('passed'), true, 'has class according to build state');
  });
});
