import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { getContext } from '@ember/test-helpers';

module('Acceptance | enterprise/beta features disabled', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('does not display link to beta features page', async function (assert) {
  let { owner } = getContext();
  owner.lookup('service:features').disable('betaFeatures');

  await visit('/profile');

  assert.dom('[data-test-profile-beta-features-link]').doesNotExist();
});
