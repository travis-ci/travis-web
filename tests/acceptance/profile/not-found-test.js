import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | profile/not found', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });

    signInUser(currentUser);
  }
});

test('try to view account that does not exist', function (assert) {
  profilePage.visit({ username: 'random-org' });

  andThen(() => {
    percySnapshot(assert);
    assert.equal(document.title, 'Account - Profile - Travis CI');
    assert.equal(profilePage.notFoundOrgName, 'random-org');
  });
});
