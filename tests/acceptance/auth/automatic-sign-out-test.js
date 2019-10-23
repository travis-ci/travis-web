import { currentRouteName } from '@ember/test-helpers';
import { visitWithAbortedTransition } from 'travis/tests/helpers/visit-with-aborted-transition';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';

module('Acceptance | automatic sign out', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('when token is invalid user should be signed out', async function (assert) {
    window.localStorage.setItem('travis.token', 'wrong-token');

    await visitWithAbortedTransition('/account');

    assert.equal(currentRouteName(), 'auth');
    percySnapshot(assert);
  });
});
