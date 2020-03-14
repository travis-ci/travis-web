import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | request configs', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const repo = {
      id: 1,
    };

    const request = {
      id: 1,
      branchName: 'master',
      commit: {
        sha: 'abcdef123',
        message: 'commit message'
      },
      repo: {
        slug: 'travis-ci/travis-yml'
      },
    };

    this.showNewConfigView = true;
    this.canTriggerBuild = true;
    this.repo = repo;
    this.request = request;
    this.status = 'open';

    await render(hbs`<Request::Configs
      @repo={{this.repo}}
      @request={{this.request}}
      @status={{this.status}}
      @showNewConfigView={{this.showNewConfigView}}
      @canTriggerBuild={{this.canTriggerBuild}}/>`
    );

    const notice = '[data-test-trigger-build-notice]';
    await waitFor(notice);
    assert.dom(notice).hasText('Trigger a build request with the following build configs');
  });
});
