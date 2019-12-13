import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import Service from '@ember/service';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { stubService } from 'travis/tests/helpers/stub-service';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | sign in', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /signin starts auth flow if unauthenticated', async function (assert) {
    assert.expect(2);

    // avoid actually contacting GitHub
    const mockAuthService = Service.extend({
      signedIn: false,
      signIn() {
        assert.ok(true);
      },
      afterSignOut() {
        return undefined;
      },
      autoSignIn() {
        return undefined;
      },
    });

    stubService('auth', mockAuthService);

    await visit('/signin');

    assert.equal(currentURL(), '/signin');
  });

  test('visiting signin redirects to index if authenticated', async function (assert) {
    const currentUser = this.server.create('user', 'withRepository');

    signInUser(currentUser);

    await visit('/signin');

    assert.equal(currentURL(), '/');
  });
});
