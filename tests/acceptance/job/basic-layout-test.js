import $ from 'jquery';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

import jobPage from 'travis/tests/pages/job';
import getFaviconUri from 'travis/utils/favicon-data-uris';

import config from 'travis/config/environment';

moduleForAcceptance('Acceptance | job/basic layout');

test('visiting job-view with config messages', function (assert) {
  let repo = server.create('repository', { slug: 'travis-ci/travis-web' }),
    branch = server.create('branch', { name: 'acceptance-tests' });

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });

  let request = server.create('request');
  server.create('message', {
    request,
    level: 'info',
    key: 'group',
    code: 'flagged',
    args: {
      given: 'group'
    }
  });

  server.create('message', {
    request,
    level: 'warn',
    key: 'language',
    code: 'unknown_default',
    args: {
      value: '__garnet__',
      default: 'ruby'
    }
  });

  server.create('message', {
    request,
    level: 'error',
    key: 'root',
    code: 'unknown_key',
    args: {
      key: 'filter_secrets',
      value: 'false'
    }
  });

  let build = server.create('build', { repository: repo, state: 'passed', commit, branch, request });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', build, commit });
  commit.job = job;

  job.save();
  commit.save();

  server.create('log', { id: job.id });

  visit('/travis-ci/travis-web/jobs/' + job.id);
  waitForElement('#log > .log-line');

  andThen(() => {
    assert.equal(document.title, 'Job #1234.1 - travis-ci/travis-web - Travis CI');

    assert.equal($('head link[rel=icon]').attr('href'), getFaviconUri('green'), 'expected the favicon data URI to match the one for passing');

    assert.equal(jobPage.branch, 'acceptance-tests', 'displays the branch');
    assert.equal(jobPage.message, 'acceptance-tests This is a message', 'displays message');
    assert.equal(jobPage.state, '#1234.1 passed', 'displays build number');
    assert.equal(jobPage.author, 'Mr T authored and committed');

    assert.ok(jobPage.ymlMessages().isVisible, 'expected the messages to be visible');
    assert.equal(jobPage.ymlMessages().count, 3, 'expected three yml messages');

    jobPage.ymlMessages(0).as(info => {
      assert.ok(info.icon.isInfo, 'expected the first yml message to be an info');
      assert.equal(info.message, 'your repository must be feature flagged for group to be used');
    });

    jobPage.ymlMessages(1).as(warning => {
      assert.ok(warning.icon.isWarning, 'expected the second yml message to be a warning');
      assert.equal(warning.message, 'dropping unknown value: __garnet__, defaulting to: ruby');
    });

    jobPage.ymlMessages(2).as(error => {
      assert.ok(error.icon.isError, 'expected the third yml message to be an error');
      assert.equal(error.message, 'dropping unknown key filter_secrets (false)');
    });

    assert.equal(jobPage.log, 'Hello log');
    assert.notOk(jobPage.hasTruncatedLog);
    assert.equal(jobPage.rawLogUrl, `https://api.travis-ci.org/v3/job/${job.id}/log.txt`);
  });

  percySnapshot(assert);
});

test('visiting a job with a truncated log', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  let branch = server.create('branch', { name: 'acceptance-tests' });

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository: repo, state: 'passed', commit, branch });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', commit, build });
  commit.job = job;

  job.save();
  commit.save();

  const longLog = new Array(config.logLimit + 1).join('🤔\n');
  server.create('log', { id: job.id, content: longLog });

  jobPage.visit();

  // An unfortunate workaround for log displaying being outside Ember facilities.
  // eslint-disable-next-line
  waitForElement('.log-container p.warning');

  andThen(function () {
    assert.ok(jobPage.hasTruncatedLog);
    assert.notOk(jobPage.ymlMessages().isVisible, 'expected no yml messages container');
  });
});

test('visiting a job with a complex log', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' }),
    branch = server.create('branch', { name: 'acceptance-tests' });

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository: repo, state: 'passed', commit, branch });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', commit, build });
  commit.job = job;

  job.save();
  commit.save();

  const ESCAPE = String.fromCharCode(27);
  const complexLog = `I am the first line.
travis_fold:start:afold
I am the first line of a fold.
I am the second line of a fold.
travis_fold:end:afold
I am a line between folds.
travis_fold:start:afold
I am the first line of a second fold.
travis_fold:end:afold
[0K[30;47;1mI am a bold black line with white background.     I have some whitespace within my line. I am very long to provoke wrapping. So I keep going on and on. And on!
[0K[31;46;3mI am an italic red line with cyan background. The next line has a long unbroken string to test wrapping of unbroken text.
[0K[32;45;4mI am an underlined green line with magenta background. ...........................................................................**....................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
[0K[33;44mI am a yellow line with blue background.
[0K[34;43mI am a blue line yellow background.
[0K[35;42mI am a magenta line with green background.
[0K[36;41mI am a cyan line with red background.
[0K[37;40mI am a white line with black background.
[0K[90mI am a grey line.
I used to be the final line.
I am another line finished by a CR.\rI replace that line?\r${ESCAPE}[0mI am the final replacer.\nI do not replace because the previous line ended with a line feed.
This should also be gone.\r This should have replaced it.
A particular log formation is addressed here, this should remain.\r${ESCAPE}[0m\nThis should be on a separate line.
But it must be addressed repeatedly!\r${ESCAPE}[0m\nAgain.
`;
  server.create('log', { id: job.id, content: complexLog });

  jobPage.visit();

  // An unfortunate workaround for log displaying being outside Ember facilities.
  // eslint-disable-next-line
  waitForElement('.log-container .yellow');

  jobPage.toggleLog();

  andThen(function () {
    assert.equal(jobPage.logLines(0).text, 'I am the first line.');

    assert.equal(jobPage.logFolds(0).name, 'afold');
    assert.notOk(jobPage.logFolds(0).isOpen);

    assert.equal(jobPage.logLines(1).text, 'I am the first line of a fold.');

    assert.equal(jobPage.logLines(2).text, 'I am the second line of a fold.');

    assert.equal(jobPage.logLines(3).text, 'I am a line between folds.');

    assert.equal(jobPage.logFolds(0).name, 'afold');
    assert.equal(jobPage.logLines(4).text, 'I am the first line of a second fold.');

    assert.ok(jobPage.logLines(5).isBlack);
    assert.ok(jobPage.logLines(5).hasWhiteBackground);
    assert.ok(jobPage.logLines(5).isBolded);

    assert.ok(jobPage.logLines(6).isRed);
    assert.ok(jobPage.logLines(6).hasCyanBackground);
    assert.ok(jobPage.logLines(6).isItalicised);

    assert.ok(jobPage.logLines(7).isGreen);
    assert.ok(jobPage.logLines(7).hasMagentaBackground);
    assert.ok(jobPage.logLines(7).isUnderlined);

    assert.ok(jobPage.logLines(8).isYellow);
    assert.ok(jobPage.logLines(8).hasBlueBackground);

    assert.ok(jobPage.logLines(9).isBlue);
    assert.ok(jobPage.logLines(9).hasYellowBackground);

    assert.ok(jobPage.logLines(10).isMagenta);
    assert.ok(jobPage.logLines(10).hasGreenBackground);

    assert.ok(jobPage.logLines(11).isCyan);
    assert.ok(jobPage.logLines(11).hasRedBackground);

    assert.ok(jobPage.logLines(12).isWhite);
    assert.ok(jobPage.logLines(12).hasBlackBackground);

    assert.ok(jobPage.logLines(13).isGrey);

    assert.equal(jobPage.logLines(14).text, 'I used to be the final line.');

    // FIXME why is this line in an adjacent span?
    assert.equal(jobPage.logLines(15).nextText, 'I am the final replacer.');
    assert.equal(jobPage.logLines(16).text, 'I do not replace because the previous line ended with a line feed.');

    assert.equal(jobPage.logLines(17).nextText, 'This should have replaced it.');

    assert.equal(jobPage.logLines(18).text, 'A particular log formation is addressed here, this should remain.');
    assert.equal(jobPage.logLines(19).text, 'This should be on a separate line.');
    assert.equal(jobPage.logLines(20).text, 'But it must be addressed repeatedly!');
    assert.equal(jobPage.logLines(21).text, 'Again.');
  });

  jobPage.logFolds(0).toggle();

  andThen(function () {
    assert.ok(jobPage.logFolds(0).isOpen);
  });

  percySnapshot(assert);
});

test('visiting a job with fold duration', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' }),
    branch = server.create('branch', { name: 'acceptance-tests' });

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository: repo, state: 'passed', commit, branch });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', commit, build });
  commit.job = job;

  job.save();
  commit.save();

  const complexLog = `I am the first line.
travis_fold:start:afold
travis_time:start:2fde4b10
I am the first line of a fold.
I am the second line of a fold.
travis_time:end:2fde4b10:start=1515663514660495538,finish=1515663517010906954,duration=2350411416
travis_fold:end:afold
`;
  server.create('log', { id: job.id, content: complexLog });

  jobPage.visit();

  // An unfortunate workaround for log displaying being outside Ember facilities.
  // eslint-disable-next-line
  waitForElement('.log-container .duration');

  jobPage.toggleLog();

  andThen(function () {
    assert.equal(jobPage.logFolds(0).duration, '2.35s');
  });

  percySnapshot(assert);
});
