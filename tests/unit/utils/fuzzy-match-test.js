import fuzzyMatch from 'travis/utils/fuzzy-match';

import { module, test } from 'qunit';

module('fuzzyMatch');

test('returns string if no match', function (assert) {
  assert.expect(1);

  assert.equal(fuzzyMatch('abc', 'z'), 'abc');
});

test('returns modified string if fuzzy match', function (assert) {
  assert.expect(1);

  assert.equal(fuzzyMatch('travis-web', 'tavw', '<', '>'), '<t>r<av>is-<w>eb');
});
