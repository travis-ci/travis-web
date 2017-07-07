import durationFrom from "travis/src/utils/duration-from/util";
import { module, test } from 'qunit';

module('Unit | Utility | duration from');

test('calculates durations in seconds', function (assert) {
  const now = new Date();

  assert.equal(durationFrom(now, now), 0);
  assert.equal(durationFrom(new Date(new Date().getTime() - 1000), null), 1, 'expected a missing finish time to use the current time');

  const aSecondAfterNow = new Date(now.getTime() + 1000);
  assert.equal(durationFrom(now, aSecondAfterNow), 1);
  assert.equal(durationFrom(aSecondAfterNow, now), -1);

  const aSecondAndAHalfAfterNow = new Date(now.getTime() + 1500);
  assert.equal(durationFrom(now, aSecondAndAHalfAfterNow), 2, 'expected times to be rounded up');

  assert.equal(durationFrom(null, null), 0, 'expected a missing start time to return zero');
});
