import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | trigger custom build', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    const branch = this.server.create('branch', {
      name: 'master',
      default: true,
      exists_on_github: true
    });
    const repo = this.server.create('repo', {
      id: 22,
      defaultBranch: branch
    });

    this.set('repo', repo);
    await render(hbs`{{trigger-custom-build repo=repo}}`);

    assert.dom('h2').hasText('Trigger a custom build\nBeta Feature');
    assert.dom('[data-test-trigger-build-branch]').containsText('master');
  });
});
