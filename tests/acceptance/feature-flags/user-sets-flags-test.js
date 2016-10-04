import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import featurePage from 'travis/tests/pages/features';

moduleForAcceptance('Acceptance | feature flags/user sets flags');

test('visiting /settings/features directly as guest', function (assert) {
  featurePage.visit();

  andThen(() => {
    assert.equal(currentURL(), '/auth');
  });
});

test('visiting /settings/features directly when authenticated but without beta program', function (assert) {
  const currentUser = server.create('user');
  signInUser(currentUser);

  featurePage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/profile/testuser');
  });
});

test('visiting /settings/features directly when authenticated with beta program', function (assert) {
  const currentUser = server.create('user', { beta_program: true });
  signInUser(currentUser);

  featurePage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/settings/features');
  });
});
