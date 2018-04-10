import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | enterprise/beta features disabled', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(() => {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('does not display link to beta features page', async function (assert) {
    await visit('/profile');

    assert.dom('[data-test-profile-beta-features-link]').doesNotExist();
  });
});
