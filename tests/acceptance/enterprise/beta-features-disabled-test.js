import { visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import { getContext } from '@ember/test-helpers';

moduleForAcceptance('Acceptance | enterprise/beta features disabled', {
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
