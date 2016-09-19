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

    // create active hook
    server.create('hook', {
      name: 'living-a-feminist-life',
      owner_name: 'feministkilljoy',
      active: true,
      admin: true
    });

    // create inactive hook
    server.create('hook', {
      name: 'willful-subjects',
      owner_name: 'feministkilljoy',
      active: false,
      admin: true
    });

    // create hook without admin permissions
    server.create('hook', {
      name: 'affect-theory-reader',
      owner_name: 'feministkilljoy',
      active: true,
      admin: false
    });

    // create other random hook to ensure correct filtering
    server.create('hook', {
      name: 'feminism-is-for-everybody',
      owner_name: 'bellhooks',
      active: false
    });
  }
});

test('view token', function (assert) {
  profilePage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.ok(profilePage.token.isHidden, 'expected token to be hidden by default');
  });

  profilePage.token.show();

  andThen(function () {
    assert.equal(profilePage.token.value, 'testUserToken');
  });
  percySnapshot(assert);
});
