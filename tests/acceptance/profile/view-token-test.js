import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import profilePage from 'travis/tests/pages/profile';
import config from 'travis/config/environment';
import signInUser from 'travis/tests/helpers/sign-in-user';
import {
  triggerCopySuccess
} from 'ember-cli-clipboard/test-support';

module('Acceptance | profile/view token', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });

    signInUser(currentUser);

    // create organization
    server.create('organization', {
      name: 'Org Name',
      login: 'org-login',
    });
  });

  test('view token', async function (assert) {
    await profilePage.visit();
    await profilePage.settings.visit();

    assert.equal(profilePage.token.obfuscatedCharacters, '••••••••••••••••••••', 'expected token to be obfuscated by default');

    await profilePage.token.show();

    assert.equal(profilePage.token.value, config.validAuthToken);
  });

  test('copy token', async function (assert) {
    await profilePage.visit();
    await profilePage.settings.visit();

    assert.equal(profilePage.token.obfuscatedCharacters, '••••••••••••••••••••', 'expected token to be obfuscated by default');

    triggerCopySuccess();

    assert.equal(profilePage.token.tokenCopiedText, 'Token copied!');

    // ensure a second copy success does not show incorrect text/feel buggy
    triggerCopySuccess();

    assert.equal(profilePage.token.tokenCopiedText, 'Token copied!');
  });
});
