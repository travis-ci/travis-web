import formatMessageContainer from 'travis/helpers/format-message';
import { module, test } from 'qunit';

const formatMessage = formatMessageContainer.compute;

module('Unit | Helper | format message', function () {
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

  test('it accepts an eventType and prefixes the message if it’s a cron', assert => {
    const formattedCron = formatMessage(['a string'], { eventType: 'cron' });
    assert.equal(formattedCron.toHTML(), "<span class='message-label badge'>cron</span> a string");

    const formattedNonCron = formatMessage(['a string'], { eventType: 'jorts' });
    assert.equal(formattedNonCron, 'a string');
  });

  test('it accepts a pre-formatting flag', assert => {
    const formattedMulti = formatMessage(['a multi-line\nmessage'], { pre: true });

    assert.equal(formattedMulti.toHTML(), 'a multi-line<br/>message');
  });

  test('it replaces colon-surrounded emoji names', assert => {
    const formattedWithEmoji = formatMessage(['a string with :joy: emoji'], {});
    assert.equal(formattedWithEmoji.string, 'a string with <span class=\"emoji emoji-sizer\" style=\"background-image:url(/images/emoji/1f602.png)\" title=\"joy\" data-codepoints=\"1f602\"></span> emoji');
  });

  test('it adds GitHub links', assert => {
    const fakeRepo = { owner: 'owner', name: 'name' };

    const formattedWithGitHubUsernameLink = formatMessage(['a string by @backspace'], { repo: fakeRepo });
    assert.equal(formattedWithGitHubUsernameLink, 'a string by <a href="https://github.com/backspace">@backspace</a>');

    const formattedWithGitHubIssueLink = formatMessage(['a string with #1919'], { repo: fakeRepo });
    assert.equal(formattedWithGitHubIssueLink, 'a string with <a href="https://github.com/owner/name/issues/1919">#1919</a>');

    const formattedWithGitHubOtherRepoIssueLink = formatMessage(['a string with travis-ci/travis-web#1919'], { repo: fakeRepo });
    assert.equal(formattedWithGitHubOtherRepoIssueLink, 'a string with <a href="https://github.com/travis-ci/travis-web/issues/1919">travis-ci/travis-web#1919</a>');

    const formattedWithGitHubCommitLink = formatMessage(['a string with travis-ci/travis-web@acab'], { repo: fakeRepo });
    assert.equal(formattedWithGitHubCommitLink, 'a string with <a href="https://github.com/travis-ci/travis-web/commit/acab">travis-ci/travis-web@acab</a>');
  });

  test('it accepts a maxLength', assert => {
    assert.equal(formatMessage(['123'], { maxLength: 3 }), '123');
    assert.equal(formatMessage(['123456789'], { maxLength: 3 }), '123…');
  });
});
