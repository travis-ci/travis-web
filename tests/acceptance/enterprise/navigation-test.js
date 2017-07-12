import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | enterprise/navigation');

test('visiting `/` without being authenticated redirects to `/auth`', function (assert) {
  withFeature('enterprise');
  visit('/');

  andThen(function () {
    assert.equal(currentURL(), '/auth');
  });
});
