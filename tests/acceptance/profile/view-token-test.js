import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import config from 'travis/config/environment';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | profile/view token', {
  beforeEach() {
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
  }
});

test('view token', function (assert) {
  profilePage.visit();
  profilePage.settings.visit();

  andThen(() => {
    assert.equal(profilePage.token.obfuscatedCharacters, '••••••••••••••••••••', 'expected token to be obfuscated by default');
  });

  profilePage.token.show();

  andThen(function () {
    assert.equal(profilePage.token.value, config.validAuthToken);
  });
});

test('copy token', function (assert) {
  profilePage.visit();
  profilePage.settings.visit();

  andThen(() => {
    assert.equal(profilePage.token.obfuscatedCharacters, '••••••••••••••••••••', 'expected token to be obfuscated by default');
  });

  triggerCopySuccess();

  andThen(function () {
    assert.equal(profilePage.token.tokenCopiedText, 'Token copied!');
  });

  // ensure a second copy success does not show incorrect text/feel buggy
  triggerCopySuccess();

  andThen(function () {
    assert.equal(profilePage.token.tokenCopiedText, 'Token copied!');
  });
});
