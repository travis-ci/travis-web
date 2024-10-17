import { currentURL } from '@ember/test-helpers';
import { visitWithAbortedTransition } from 'travis/tests/helpers/visit-with-aborted-transition';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | automatic sign out', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    try {
      const currentUser = this.server.create('user');

      enableFeature('proVersion');
      signInUser(currentUser);
    } catch (e) {
      console.log(e);
    }
  });

  test('when token is invalid user should be signed out', async function (assert) {
    const userRecord = this.owner.lookup('service:store').createRecord('user', {
      id: 1,
      name: 'Test User',
      webToken: 'valid-token'
    });

    // Set currentUser to userRecord
    this.owner.lookup('service:auth').set('currentUser', userRecord);

    window.localStorage.setItem('travis.webToken', 'wrong-token');

    await visitWithAbortedTransition('/account');

    assert.equal(topPage.flashMessage.text, "You've been signed out, because your access token has expired.");
    assert.equal(currentURL(), '/signin');
  });
});
