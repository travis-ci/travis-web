import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { setupMirage } from 'ember-cli-mirage/test-support';
import proHeader from 'travis/tests/pages/header/pro';
import footer from 'travis/tests/pages/footer';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | layouts/plans page', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('plans page renders correct header/footer', async function (assert) {
    enableFeature('proVersion');

    await visit('/plans');

    assert.equal(currentURL(), '/plans');

    assert.ok(proHeader.logoPresent, 'Pro header has logo');

    assert.equal(proHeader.navigationLinks[0].title, 'Help', 'Shows link to team page');

    assert.ok(proHeader.loginLinkPresent, 'Pro header has login button');
  });

  test('plans page redirects unless pro enabled', async function (assert) {
    await visit('/plans');

    assert.equal(currentURL(), '/');
  });
});
