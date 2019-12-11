import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { getContext } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | enterprise/beta features disabled', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user');
    signInUser(currentUser);
  });

  test('does not display link to beta features page', async function (assert) {
    let { owner } = getContext();
    owner.lookup('service:features').disable('betaFeatures');

    await visit('/profile');

    assert.dom('[data-test-profile-beta-features-link]').doesNotExist();
  });
});
