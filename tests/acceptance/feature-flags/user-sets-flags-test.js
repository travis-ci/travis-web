import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import featurePage from 'travis/tests/pages/features';

moduleForAcceptance('Acceptance | feature flags/user sets flags');

test('visiting /features directly as guest', function (assert) {
  featurePage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/auth');
  });
});

test('visiting /features directly when authenticated', function (assert) {
  const currentUser = server.create('user');
  signInUser(currentUser);

  featurePage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/features');
  });
});
