import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import helpPage from 'travis/tests/pages/help';

module('Acceptance | help page', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
  });

  module('for unauthorised user', function (hooks) {
    hooks.beforeEach(async function () {
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {
      const { greetingSection, supportSection } = helpPage;
      const { username, header, navigationLinks, status } = greetingSection;

      assert.ok(greetingSection.isPresent);
      assert.ok(header.isPresent);
      assert.ok(navigationLinks.isPresent);
      assert.ok(status.isPresent);
      assert.notOk(username.isPresent);

      assert.ok(supportSection.isPresent);
    });

    test('it shows log in stub', function (assert) {
      const { logInImage, logInButton } = helpPage.supportSection;

      assert.ok(logInImage.isPresent);
      assert.ok(logInButton.isPresent);
    });
  });

  module('for authorised user', function (hooks) {
    hooks.beforeEach(async function () {
      this.user = server.create('user');
      await signInUser(this.user);
      await helpPage.visit();
    });

    test('it has correct structure', function (assert) {
      const { greetingSection, supportSection } = helpPage;
      const { username, header, navigationLinks, status } = greetingSection;

      assert.ok(greetingSection.isPresent);
      assert.ok(header.isPresent);
      assert.ok(navigationLinks.isPresent);
      assert.ok(status.isPresent);
      assert.ok(username.isPresent);
      assert.equal(username.text, this.user.name);

      assert.ok(supportSection.isPresent);
    });

    test('it shows request form', function (assert) {
      const { form } = helpPage.supportSection;

      assert.ok(form.isPresent);
    });
  });
});
