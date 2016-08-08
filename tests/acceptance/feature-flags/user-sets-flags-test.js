import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | feature flags/user sets flags');

test('visiting /features directly', function (assert) {
  visit('/features');

  andThen(function () {
    assert.equal(currentURL(), '/features');
  });
});
