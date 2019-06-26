import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import defaultHeader from 'travis/tests/pages/header/default';
import footer from 'travis/tests/pages/footer';
import signOutUser from 'travis/tests/helpers/sign-out-user';

module('Acceptance | layouts/logo page', function (hooks) {
  setupApplicationTest(hooks);

  test('logo page renders correct header/footer', async function (assert) {
    const currentUser = server.create('user');
    signOutUser(currentUser);

    await visit('/logo');

    assert.equal(currentURL(), '/logo');

    assert.ok(defaultHeader.logoPresent, 'Default header has logo');
    assert.equal(defaultHeader.navigationLinks[0].title, 'About Us', 'Shows link to About Us');
    assert.equal(defaultHeader.navigationLinks[1].title, 'Blog', 'Shows link to Blog');
    assert.equal(defaultHeader.navigationLinks[2].title, 'Status', 'Shows link to Status');
    assert.equal(defaultHeader.navigationLinks[3].title, 'Documentation', 'Shows link to Documentation');

    assert.ok(defaultHeader.loginLinkPresent, 'Default header has login button');

    assert.equal(footer.sections[2].title, '©Travis CI, GmbH', 'Shows company info section');
    assert.equal(footer.sections[3].title, 'Help', 'Shows help info section');
  });
});
