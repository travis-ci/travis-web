import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | builds item', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

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
        message: 'Generic test author commit message',
        url: 'a-url'
      },
      repo: {
        slug: 'foo/bar',
        name: 'bar',
        vcs_name: 'bar',
        owner_name: 'foo'
      }
    };
    this.build = build;
    await render(hbs`{{builds-item build=build}}`);
    assert.dom('.row-li').hasClass('passed', 'component has right status class');
    assert.dom('.row-branch a').hasText('foobarbranch', 'component renders branch if event is push');
    assert.dom('.row-branch a').hasAttribute('title', 'foobarbranch');
    assert.dom('.row-commit a').hasAttribute('href', 'a-url', 'component uses commit github url');
    assert.dom('.row-message').hasText('Generic test author commit message');
  });

  test('it renders a pull request', async function (assert) {
    const build = {
      id: 10000,
      state: 'failed',
      message: void 0,
      isPullRequest: true,
      pullRequestNumber: 1919,
      pullRequestTitle: 'Strike!',
    };
    this.build = build;
    await render(hbs`{{builds-item build=build}}`);
    assert.dom('.row-li').hasClass('failed');
    assert.dom('.row-branch a').hasText('PR #1919');
    assert.dom('.row-branch a').hasAttribute('title', 'PR #1919 Strike!');
    assert.dom('.row-message').hasText('Strike!');
  });

  test('it renders a tag', async function (assert) {
    const build = {
      id: 10000,
      state: 'errored',
      number: 11,
      message: void 0,
      isTag: true,
      tag: {
        name: 'Strike!',
      },
    };
    this.build = build;
    await render(hbs`{{builds-item build=build}}`);
    assert.dom('.row-li').hasClass('errored');
    assert.dom('.row-branch a').hasText('Strike!');
    assert.dom('.row-branch a').hasAttribute('title', 'Strike!');
  });

  test('it renders a draft label', async function (assert) {
    const build = {
      id: 10000,
      state: 'failed',
      message: void 0,
      isPullRequest: true,
      pullRequestNumber: 1919,
      pullRequestTitle: 'Strike!',
      request: {
        isDraft: true
      }
    };

    this.build = build;
    await render(hbs`{{builds-item build=build}}`);
    assert.dom('.row-branch .badge').hasText('draft');
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
