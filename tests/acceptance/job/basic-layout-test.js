import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';

import config from 'travis/config/environment';

moduleForAcceptance('Acceptance | job/basic layout');

test('visiting job-view', function (assert) {
  assert.expect(7);

  let repo = server.create('repository', { slug: 'travis-ci/travis-web' }),
    branch = server.create('branch', { name: 'acceptance-tests' });

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository: repo, state: 'passed', commit, branch });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', build, commit });
  commit.job = job;

  job.save();
  commit.save();

  server.create('log', { id: job.id });

  visit('/travis-ci/travis-web/jobs/' + job.id);
  waitForElement('#log > p');

  andThen(() => {
    assert.equal(document.title, 'Job #1234.1 - travis-ci/travis-web - Travis CI');

    assert.equal(jobPage.branch, 'acceptance-tests');
    assert.equal(jobPage.message, 'acceptance-tests This is a message');
    assert.equal(jobPage.state, '#1234.1 passed');
    assert.equal(jobPage.author, 'Mr T authored and committed');

    assert.equal(jobPage.log, 'Hello log');
    assert.notOk(jobPage.hasTruncatedLog);
  });
});

test('visiting a job with a truncated log', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  let branch = server.create('branch', { name: 'acceptance-tests' });

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository: repo, state: 'passed', commit, branch });
  let job = server.create('job', { number: '1234.1', repository: repo, state: 'passed', commit, build });
  commit.job = job;

  job.save();
  commit.save();

  const longLog = new Array(config.logLimit + 1).join('🤔\n');
  server.create('log', { id: job.id, content: longLog });

  jobPage.visit();

  // An unfortunate workaround for log displaying being outside Ember facilities.
  //eslint-disable-next-line
  waitForElement('.log-container p.warning');

  andThen(function () {
    assert.ok(jobPage.hasTruncatedLog);
  });
});

test('visiting a job with a complex log', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' }),
    branch = server.create('branch', { name: 'acceptance-tests' });

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
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
[0K[30;47;1mI am a bold black line with white background.
[0K[31;46;3mI am an italic red line with cyan background.
[0K[32;45;4mI am an underlined green line with magenta background.
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
  //eslint-disable-next-line
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
