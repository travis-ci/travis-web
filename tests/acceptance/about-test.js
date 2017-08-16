import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | about');

test('visiting /about', function (assert) {
  visit('/about');

  andThen(function () {
    assert.equal(currentURL(), '/about');
    percySnapshot(assert);
  });
});
