import fuzzyMatch from 'travis/utils/fuzzy-match';

const { module, test } = QUnit;

module('fuzzyMatch');

test('returns string if no match', function (assert) {
  assert.expect(1);

  assert.equal(fuzzyMatch('abc', 'z'), 'abc');
});

test('returns modified string if fuzzy match', function (assert) {
  assert.expect(1);

  assert.equal(fuzzyMatch('travis-web', 'tavw', '<', '>'), '<t>r<av>is-<w>eb');
});
