import timeInWords from 'travis/utils/time-in-words';
import { module, test } from 'qunit';

module('Unit | Utility | time in words');

test('it translates durations in seconds to abbreviated words', function (assert) {
  assert.equal(timeInWords(59), '59 sec');
  assert.equal(timeInWords(60), '1 min');
  assert.equal(timeInWords(61), '1 min 1 sec');

  assert.equal(timeInWords(3600), '1 hr');
  assert.equal(timeInWords(3660), '1 hr 1 min');
  assert.equal(timeInWords(3661), '1 hr 1 min 1 sec');

  assert.equal(timeInWords(7200), '2 hrs');

  assert.equal(timeInWords(86400 + 1), 'more than 24 hrs', 'expected a duration longer than a day to be truncated');

  assert.equal(timeInWords(-1), '', 'expected an invalid duration to return just a hyphen');
});
