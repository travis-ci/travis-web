import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';

module('Acceptance | logo', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /logo', async function (assert) {
    await visit('/logo');

    assert.equal(currentURL(), '/logo');
    percySnapshot(assert);
  });
});
