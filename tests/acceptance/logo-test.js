import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | logo');

test('visiting /logo', function (assert) {
  visit('/logo');

  andThen(function () {
    assert.equal(currentURL(), '/logo');
    percySnapshot(assert);
  });
});
