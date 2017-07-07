import formatSha from "travis/src/utils/format-sha/util";
import { module, test } from 'qunit';

module('Unit | Utility | format sha');

test('it truncates a SHA', function (assert) {
  assert.equal(formatSha('123456789'), '1234567');
  assert.equal(formatSha('acab'), 'acab', 'expected a short SHA to not be truncated');
});
