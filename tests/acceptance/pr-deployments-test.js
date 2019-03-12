import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | pr deployments', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /pr-deployments', async function (assert) {
    await visit('/pr-deployments');

    assert.equal(currentURL(), '/pr-deployments');
    assert.ok(false);
  });
});
