import { module, test } from 'qunit';
import { currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { percySnapshot } from 'ember-percy';
import signInUser from 'travis/tests/helpers/sign-in-user';
import unsubscribePage from 'travis/tests/pages/unsubscribe';
import { setupMirage } from 'ember-cli-mirage/test-support';

const { emailUnsubscribe } = unsubscribePage;

module('Acceptance | profile/unsubscribe', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.user = this.server.create('user', { login: 'some-user' });
    this.server.create('allowance', { subscription_type: 1 });
    await signInUser(this.user);
  });

  module('for invalid repository', function (hooks) {
    hooks.beforeEach(async function () {
      this.repo = this.server.create('repository', {
        owner: {
          login: 'some-user',
          id: 1
        },
        owner_name: 'some-user'
      });
      await unsubscribePage.visit({ repository: '2' });
    });

    test('it renders correct view', function (assert) {
      const { sadmail, title, description, primaryButton, secondaryButton, appendix } = emailUnsubscribe;

      percySnapshot(assert);

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
        this.repo = this.server.create('repository', {
          email_subscribed: true,
          owner: {
            login: this.user.login,
            id: this.user.id
          },
          owner_name: this.user.login
        });
        await unsubscribePage.visit({ repository: this.repo.id });
      });

      test('it renders correct view', function (assert) {
        const { sadmail, title, description, primaryButton, secondaryButton, appendix } = emailUnsubscribe;

        percySnapshot(assert);

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

        assert.ok(primaryButton.isUnsubscribe);

        await primaryButton.click();

        assert.ok(primaryButton.isResubscribe);
      });

      test('it allows to cancel unsubscription', async function (assert) {
        const { secondaryButton } = emailUnsubscribe;
        await secondaryButton.click();
        assert.equal(currentRouteName(), 'repo.index');
      });
    });

    module('when unsubscribed', function (hooks) {
      hooks.beforeEach(async function () {
        this.repo = this.server.create('repository', {
          email_subscribed: false,
          owner: {
            login: this.user.login,
            id: this.user.id
          },
          owner_name: this.user.login
        });
        await unsubscribePage.visit({ repository: this.repo.id });
      });

      test('it renders correct view', function (assert) {
        const { sadmail, title, description, primaryButton, secondaryButton, appendix } = emailUnsubscribe;

        percySnapshot(assert);

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

        assert.ok(primaryButton.isResubscribe);

        await primaryButton.click();

        assert.ok(primaryButton.isUnsubscribe);
      });

      test('it allows to leave the page', async function (assert) {
        const { secondaryButton } = emailUnsubscribe;
        await secondaryButton.click();
        assert.equal(currentRouteName(), 'repo.index');
      });
    });
  });
});
