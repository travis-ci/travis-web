import { module, test } from 'qunit';
import { currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import unsubscribePage from 'travis/tests/pages/unsubscribe';

const { emailUnsubscribe } = unsubscribePage;

module('Acceptance | profile/unsubscribe', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.user = server.create('user');
    await signInUser(this.user);
  });

  module('for invalid repository', function (hooks) {
    hooks.beforeEach(async function () {
      this.repo = server.create('repository', {
        owner: {
          login: 'some-user'
        }
      });
      await unsubscribePage.visit({ username: this.user.login, repository: '2' });
    });

    test('it renders correct view', function (assert) {
      const { sadmail, title, description, primaryButton, secondaryButton, appendix } = emailUnsubscribe;

      assert.ok(sadmail.isPresent);
      assert.ok(title.isPresent);
      assert.ok(description.isPresent);
      assert.ok(primaryButton.isPresent);
      assert.ok(!secondaryButton.isPresent);
      assert.ok(!appendix.isPresent);
    });
  });

  module('for valid repository', function (hooks) {
    module('when subscribed', function (hooks) {
      hooks.beforeEach(async function () {
        this.repo = server.create('repository', {
          email_subscribed: true,
          owner: {
            login: this.user.login
          }
        });
        await unsubscribePage.visit({ username: this.user.login, repository: this.repo.id });
      });

      test('it renders correct view', function (assert) {
        const { sadmail, title, description, primaryButton, secondaryButton, appendix } = emailUnsubscribe;

        assert.ok(sadmail.isPresent);
        assert.ok(title.isPresent);
        assert.ok(description.isPresent);
        assert.ok(primaryButton.isPresent);
        assert.ok(primaryButton.isUnsubscribe);
        assert.ok(secondaryButton.isPresent);
        assert.ok(appendix.isPresent);
      });

      test('it allows to unsubscribe', async function (assert) {
        const { primaryButton } = emailUnsubscribe;
        let isSubscribed = true;

        server.delete(`/repo/${this.repo.id}/email_subscription`, function () {
          isSubscribed = false;
        });

        assert.ok(primaryButton.isUnsubscribe);

        await primaryButton.click();

        assert.ok(primaryButton.isResubscribe);
        assert.equal(isSubscribed, false);
      });

      test('it allows to cancel unsubscription', async function (assert) {
        const { secondaryButton } = emailUnsubscribe;
        await secondaryButton.click();
        assert.equal(currentRouteName(), 'repo.index');
      });
    });

    module('when unsubscribed', function (hooks) {
      hooks.beforeEach(async function () {
        this.repo = server.create('repository', {
          email_subscribed: false,
          owner: {
            login: this.user.login
          }
        });
        await unsubscribePage.visit({ username: this.user.login, repository: this.repo.id });
      });

      test('it renders correct view', function (assert) {
        const { sadmail, title, description, primaryButton, secondaryButton, appendix } = emailUnsubscribe;

        assert.ok(sadmail.isPresent);
        assert.ok(title.isPresent);
        assert.ok(description.isPresent);
        assert.ok(primaryButton.isPresent);
        assert.ok(primaryButton.isResubscribe);
        assert.ok(secondaryButton.isPresent);
        assert.ok(appendix.isPresent);
      });

      test('it allows to re-subscribe', async function (assert) {
        const { primaryButton } = emailUnsubscribe;
        let isSubscribed = false;

        server.post(`/repo/${this.repo.id}/email_subscription`, function () {
          isSubscribed = true;
        });

        assert.ok(primaryButton.isResubscribe);

        await primaryButton.click();

        assert.ok(primaryButton.isUnsubscribe);
        assert.equal(isSubscribed, true);
      });

      test('it allows to leave the page', async function (assert) {
        const { secondaryButton } = emailUnsubscribe;
        await secondaryButton.click();
        assert.equal(currentRouteName(), 'repo.index');
      });
    });
  });
});
