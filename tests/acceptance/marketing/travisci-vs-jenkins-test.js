import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';

export const PAGE_URL = '/travisci-vs-jenkins';
export const HEADER_TITLE = '[data-test-tvj-page-header-title]';
export const HEADER_BUTTON = '[data-test-tvj-page-header-button]';
export const HEADER_IMAGE = '[data-test-tvj-page-header-image]';

module('Acceptance | travis vs jenkins page', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    await visit(PAGE_URL);
  });

  test('page structure', async function (assert) {
    assert.equal(currentURL(), PAGE_URL);

    assert.dom(HEADER_TITLE).exists();
    assert.dom(HEADER_BUTTON).exists();
    assert.dom(HEADER_IMAGE).exists();

    percySnapshot(assert);
  });
});
