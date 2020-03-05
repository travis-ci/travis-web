import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | request configs', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {

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

    this.load = {
      perform() { }
    };
    this.displayTriggerBuild = true;
    this.request = request;
    this.showNewConfigView = true;
    this.status = 'open';

    await render(hbs`<Request::Configs 
      @request={{this.request}} 
      @status={{this.status}} 
      @load={{this.load}}
      @showNewConfigView={{this.showNewConfigView}}
      @displayTriggerBuild={{this.displayTriggerBuild}}/>`
    );
    await waitFor('[data-test-trigger-build-description]');

    assert.dom('[data-test-trigger-build-description]').hasText('Trigger a build request with the following build configs');
  });
});
