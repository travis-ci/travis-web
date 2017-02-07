import formatMessageContainer from 'travis/helpers/format-message';
import { module, test } from 'qunit';

const formatMessage = formatMessageContainer.compute;

module('Unit | Helper | format message');

test('it formats a Git commit message', function (assert) {
  const formatted = formatMessage(['a string'], {});

  assert.equal(formatted, 'a string');
});
