import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';

module('Acceptance | profile/not found', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });

    signInUser(currentUser);
  });

  test('try to view account that does not exist', async function (assert) {
    await profilePage.visitOrganization({ name: 'random-org' });

    percySnapshot(assert);
    assert.equal(document.title, 'Account - Profile - Travis CI');
    assert.equal(profilePage.notFoundOrgName, 'random-org');
  });
});
