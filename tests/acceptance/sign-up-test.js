import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import Service from '@ember/service';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { stubService } from 'travis/tests/helpers/stub-service';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';

const SELECTORS = {
  PAGE: '[data-test-signup-page]',
  BUTTON_PRIMARY: '[data-test-signin-button-primary]',
  BUTTON_ASSEMBLA: '[data-test-signin-button="assembla"]',
  BUTTON_BITBUCKET: '[data-test-signin-button="bitbucket"]',
};

module('Acceptance | sign up', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /signup shows signup page if unauthenticated', async function (assert) {
    let signupRequest;

    // avoid actually contacting GitHub
    const mockAuthService = Service.extend({
      signedIn: false,
      signIn() {
        return undefined;
      },
      signInWith(provider) {
        signupRequest = provider;
      },
      afterSignOut() {
        return undefined;
      },
      autoSignIn() {
        return undefined;
      },
    });

    stubService('auth', mockAuthService);

    await visit('/signup');

    assert.equal(currentURL(), '/signup');
    assert.dom(SELECTORS.PAGE).exists();
    assert.dom(SELECTORS.BUTTON_PRIMARY).containsText('Sign Up With GitHub');
    assert.dom(SELECTORS.BUTTON_ASSEMBLA).doesNotExist();
    assert.dom(SELECTORS.BUTTON_BITBUCKET).doesNotExist();

    await click(SELECTORS.BUTTON_PRIMARY);

    assert.equal(signupRequest, 'github');

    percySnapshot(assert);
  });

  test('visiting signup redirects to index if authenticated', async function (assert) {
    const currentUser = this.server.create('user', 'withRepository');

    signInUser(currentUser);

    await visit('/signup');

    assert.equal(currentURL(), '/');
  });
});
