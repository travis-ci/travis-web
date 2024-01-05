import { module, test } from 'qunit';
import { setupApplicationTestCustom } from 'travis/tests/helpers/setup-application-test';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | profile/not found', function (hooks) {
  setupApplicationTestCustom(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });

    signInUser(currentUser);
  });

  test('try to view account that does not exist', async function (assert) {
    await profilePage.visitOrganization({ name: 'random-org' });


    assert.equal(document.title, 'Travis Tests');
    assert.equal(profilePage.notFoundOrgName, 'random-org');
  });
});
