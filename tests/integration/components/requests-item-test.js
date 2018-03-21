import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { prettyDate } from 'travis/helpers/pretty-date';

module('Integration | Component | requests item', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const request = {
      id: 1,
      branchName: 'dev',
      commit: {
        sha: 'abcdef123',
        message: 'Bam! :bomb:'
      },
      repo: {
        slug: 'travis-ci/travis-ci'
      },
      build: {
        number: 10
      },
      result: 'approved',
      created_at: yesterday,
      isAccepted: true
    };

    this.request = request;
    await render(hbs`{{requests-item request=request}}`);

    assert.dom('.row-item:nth-of-type(2) strong').hasText('dev');
    assert.dom('.row-item:nth-of-type(3) .label-align').hasText('a day ago');
    assert.dom('.row-item:nth-of-type(3)').hasAttribute('title', `${prettyDate([yesterday])}`);
    assert.dom('.status-icon').hasClass('approved', 'icon should have approved class');
    assert.dom('.row-item:nth-child(4)').hasText('Bam!');
    assert.dom('.row-item:nth-child(4) .emoji').exists('there should be an emoji icon in commit message');
    return assert.dom('.row-item:nth-child(5) .label-align').hasText('10', 'build number should be displayed');
  });

  test('it renders PR number if a request is a PR', async function (assert) {
    const request = {
      id: 1,
      isPullRequest: true,
      pullRequestNumber: 20
    };

    this.request = request;
    await render(hbs`{{requests-item request=request}}`);
    return assert.dom('.row-item:nth-child(2) strong').hasText('#20');
  });
});
