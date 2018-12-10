import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import helpPage from 'travis/tests/pages/help';

module('Acceptance | help page', function (hooks) {
  setupApplicationTest(hooks);

  module('for unauthorised user', function (hooks) {
    hooks.beforeEach(async function () {
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {

    });
  });

  module('for authorised user', function (hooks) {
    hooks.beforeEach(async function () {
      this.user = server.create('user');
      await signInUser(this.user);
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {

    });
  });
});
