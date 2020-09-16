import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | request configs', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    this.repo = this.server.create('repository');
    this.request = this.server.create('request');
    this.canTriggerBuild = true;
    this.status = 'open';

    await render(hbs`<Request::Configs
      @repo={{this.repo}}
      @request={{this.request}}
      @status={{this.status}}
      @canTriggerBuild={{this.canTriggerBuild}}/>`
    );

    const notice = '[data-test-trigger-build-notice]';
    await waitFor(notice);
    assert.dom(notice).hasText('Trigger a build request with the following build configs.');
  });
});
