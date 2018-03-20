import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('RepositoryStatusToggleComponent', function(hooks) {
  setupRenderingTest(hooks);

  test('it switches state when clicked', async function(assert) {
    this.set('repository', {
      id: 10000,
      name: 'foo-bar',
      owner: {
        login: 'foo',
      },
      description: 'A foo repo',
      active: true,
      urlGithub: 'https://github.com/foo/foobar',
      slug: 'foo/foo-bar',
      permissions: {
        admin: false,
      },
    });

    await render(hbs`{{repository-status-toggle repository=repository}}`);

    assert.ok(this.$('.switch').hasClass('active'), 'switch should have active class');
  });
});