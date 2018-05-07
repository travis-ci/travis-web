import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { percySnapshot } from 'ember-percy';

module('Acceptance | logo', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /logo', async function (assert) {
    await visit('/logo');

    assert.equal(currentURL(), '/logo');
    percySnapshot(assert);
  });
});
