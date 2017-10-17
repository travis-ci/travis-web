import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | fail');

test('total failure', function (assert) {
  visit('/');

  andThen(() => {
    assert.ok(false, 'expected failure');
  });
});

test('total success', function (assert) {
  visit('/');

  andThen(() => {
    assert.ok(true, 'expected success!');
  });
});
