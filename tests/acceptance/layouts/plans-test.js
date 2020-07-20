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

    assert.equal(proHeader.navigationLinks[0].title, 'About Us', 'Shows link to team page');
    assert.equal(proHeader.navigationLinks[1].title, 'Plans & Pricing', 'Shows link to plans page');
    assert.equal(proHeader.navigationLinks[2].title, 'Enterprise', 'Shows link to Enterprise offering');

    assert.ok(proHeader.loginLinkPresent, 'Pro header has login button');
    assert.equal(footer.sections[2].title, '©Travis CI, GmbH', 'Shows company info section');
    assert.equal(footer.sections[3].title, 'Help', 'Shows help info section');
    assert.equal(footer.sections[4].title, 'Company', 'Shows legal info section');
  });

  test('plans page redirects unless pro enabled', async function (assert) {
    await visit('/plans');

    assert.equal(currentURL(), '/');
  });
});
