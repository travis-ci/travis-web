import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | trigger custom build', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    let repo = {
      id: 22,
      branches: [
        {
          name: 'master',
          default: true,
          exists_on_github: true
        }
      ]
    };
    this.set('repo', repo);
    await render(hbs`{{trigger-custom-build repo=repo}}`);

    assert.equal(this.$().find('h2').text().trim(), 'Trigger a custom build\nBeta Feature');
    assert.equal(this.$().find('select').val(), 'master');
  });
});
