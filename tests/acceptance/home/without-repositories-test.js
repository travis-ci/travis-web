import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sidebarPage from 'travis/tests/pages/sidebar';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';

module('Acceptance | home/without repositories', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('signed in but without repositories', async function (assert) {
    await sidebarPage.visit();

    assert.equal(currentURL(), '/getting_started');
    percySnapshot(assert);
  });
});
