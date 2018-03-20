import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';

module('Acceptance | plans', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /plans', async function(assert) {
    enableFeature('pro-version');
    await visit('/plans');

    assert.equal(currentURL(), '/plans');
    percySnapshot(assert);
  });
});
