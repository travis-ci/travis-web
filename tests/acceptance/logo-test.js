import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTestCustom } from 'travis/tests/helpers/setup-application-test';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | logo', function (hooks) {
  setupApplicationTestCustom(hooks);
  setupMirage(hooks);

  test('visiting /logo', async function (assert) {
    await visit('/logo');

    assert.equal(currentURL(), '/logo');
  });
});
