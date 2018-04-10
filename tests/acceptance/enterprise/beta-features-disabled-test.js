import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | enterprise/beta features disabled', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('does not display link to beta features page', function (assert) {
  this.application.__container__.lookup('service:features').disable('betaFeatures');

  visit('/profile');

  andThen(() => {
    assert.notOk(find('[data-test-profile-beta-features-link]').length);
  });
});
