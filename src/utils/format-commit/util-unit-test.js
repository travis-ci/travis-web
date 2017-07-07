import formatCommit from "travis/src/utils/format-commit/util";
import { module, test } from 'qunit';

module('Unit | Utility | format commit');

test('it formats a commit with an optional branch', function (assert) {
  assert.equal(formatCommit('acab', 'universal-liberation'), 'acab (universal-liberation)');
  assert.equal(formatCommit('acab'), 'acab', 'expected a missing branch to result in no branch in the output');
});
