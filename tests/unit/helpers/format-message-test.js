import formatMessageContainer from 'travis/helpers/format-message';
import { module, test } from 'qunit';

const formatMessage = formatMessageContainer.compute;

module('Unit | Helper | format message');

test('it formats a Git commit message', function (assert) {
  const formatted = formatMessage(['a string'], {});

  assert.equal(formatted, 'a string');
});

test('it formats a multi-line message', function (assert) {
  const formatted = formatMessage(['a multi-line\nmessage'], {});

  assert.equal(formatted, 'a multi-line\nmessage');
});

test('it accepts a shortening flag', assert => {
  const formattedSingle = formatMessage(['a string'], { short: true });
  assert.equal(formattedSingle, 'a string');

  const formattedMulti = formatMessage(['a multi-line\nmessage'], { short: true });
  assert.equal(formattedMulti, 'a multi-line');
});

test('it replaces colon-surrounded emoji names', assert => {
  const formattedWithEmoji = formatMessage(['a string with :joy: emoji'], {});
  assert.equal(formattedWithEmoji, 'a string with <span class=\"emoji emoji-sizer\" style=\"background-image:url(/images/emoji/1f602.png)\" title=\"joy\"></span> emoji');
});
