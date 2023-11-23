import { currentURL } from '@ember/test-helpers';
import { visitWithAbortedTransition } from 'travis/tests/helpers/visit-with-aborted-transition';
import { module, test, skip } from 'qunit';
import { setupApplicationTestCustom } from 'travis/tests/helpers/setup-application-test';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | automatic sign out', function (hooks) {
  setupApplicationTestCustom(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user');
    enableFeature('proVersion');
    signInUser(currentUser);
  });

  skip('when token is invalid user should be signed out', async function (assert) {
    window.localStorage.setItem('travis.token', 'wrong-token');

    await visitWithAbortedTransition('/account');

    assert.equal(topPage.flashMessage.text, "You've been signed out, because your access token has expired.");
    assert.equal(currentURL(), '/signin');
  });
});
