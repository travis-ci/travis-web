import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile/view token', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    // create organization
    server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });
  }
});

test('view token', function (assert) {
  profilePage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.equal(profilePage.token.hiddenMessage, 'hidden', 'expected token to be hidden by default');
  });

  profilePage.token.show();

  andThen(function () {
    assert.equal(profilePage.token.value, 'testUserToken');
  });
  percySnapshot(assert);
});

test('copy token', function (assert) {
  profilePage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.equal(profilePage.token.hiddenMessage, 'hidden', 'expected token to be hidden by default');
  });

  triggerCopySuccess();

  andThen(function () {
    assert.equal(profilePage.token.tokenCopiedText, 'Token copied!');
  });
  percySnapshot(assert);
});
