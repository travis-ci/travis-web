import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | builds item', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const build = {
      id: 10000,
      state: 'passed',
      number: 11,
      branchName: 'foobarbranch',
      message: void 0,
      pullRequest: false,
      eventType: 'push',
      commit: {
        sha: 'a5e8093098f9c0fb46856b753fb8943c7fbf26f3',
        branch: 'foobarbranch',
        authorName: 'Test Author',
        authorEmail: 'author@example.com',
        message: 'Generic test author commit message'
      },
      repo: {
        slug: 'foo/bar'
      }
    };
    this.build = build;
    await render(hbs`{{builds-item build=build}}`);
    assert.dom('.row-li').hasClass('passed', 'component has right status class');
    assert.dom('.row-branch a').hasText('foobarbranch', 'component renders branch if event is push');
    assert.dom('.row-commit a').hasAttribute('href', 'https://github.com/foo/bar/commit/a5e8093098f9c0fb46856b753fb8943c7fbf26f3', 'component generates right commit link');
    assert.dom('.row-message').hasText('Generic test author commit message');
  });

  test('it renders a cron build with a prefix', async function (assert) {
    const build = {
      eventType: 'cron',
      commit: {
        message: 'A cron message'
      }
    };

    this.build = build;
    await render(hbs`{{builds-item build=build}}`);

    assert.dom('.row-message').hasText('cron A cron message');
  });
});
