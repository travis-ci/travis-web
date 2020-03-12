import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import Service from '@ember/service';
import { stubService } from 'travis/tests/helpers/stub-service';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';

const SELECTORS = {
  PAGE: '[data-test-signin-page]',
  BUTTON_PRIMARY: '[data-test-signin-button-primary]',
  BUTTON_ASSEMBLA: '[data-test-signin-button="assembla"]',
  BUTTON_BITBUCKET: '[data-test-signin-button="bitbucket"]',
};

module('Acceptance | sign in', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /signin shows signin page if unauthenticated', async function (assert) {
    let signinRequest;

    // avoid actually contacting GitHub
    const mockAuthService = Service.extend({
      signedIn: false,
      signIn() {
        return undefined;
      },
      signInWith(provider) {
        signinRequest = provider;
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
    assert.dom(SELECTORS.PAGE).exists();
    assert.dom(SELECTORS.BUTTON_PRIMARY).containsText('GitHub');
    assert.dom(SELECTORS.BUTTON_ASSEMBLA).doesNotExist();
    assert.dom(SELECTORS.BUTTON_BITBUCKET).doesNotExist();

    await click(SELECTORS.BUTTON_PRIMARY);

    assert.equal(signinRequest, 'github');

    percySnapshot(assert);
  });
});
