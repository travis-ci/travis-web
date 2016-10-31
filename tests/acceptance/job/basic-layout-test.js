import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';

import config from 'travis/config/environment';

moduleForAcceptance('Acceptance | job/basic layout');

test('visiting job-view', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'passed', commit_id: commit.id, commit });
  let job = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit, build });
  commit.job = job;

  job.save();
  commit.save();

  server.create('log', { id: job.id });

  visit('/travis-ci/travis-web/jobs/' + job.id);

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
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'passed', commit_id: commit.id, commit });
  let job = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit, build });
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
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'passed', commit_id: commit.id, commit });
  let job = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit, build });
  commit.job = job;

  job.save();
  commit.save();

  const complexLog = `I am the first line.
[0K[33;1mI am a yellow line.
travis_fold:start:afold
I am the first line of a fold.
I am the second line of a fold.
travis_fold:end:afold
I am a line between folds.
travis_fold:start:afold
I am the first line of a second fold.
travis_fold:end:afold
I am the final line.
`;
  server.create('log', { id: job.id, content: complexLog });

  jobPage.visit();

  // An unfortunate workaround for log displaying being outside Ember facilities.
  //eslint-disable-next-line
  waitForElement('.log-container .yellow');

  jobPage.toggleLog();

  andThen(function () {
    assert.equal(jobPage.logLines(0).text, 'I am the first line.');
    assert.equal(jobPage.logLines(1).text, 'I am a yellow line.');
    assert.ok(jobPage.logLines(1).isYellow);

    assert.equal(jobPage.logFolds(0).name, 'afold');
    assert.notOk(jobPage.logFolds(0).isOpen);

    assert.equal(jobPage.logLines(2).text, 'I am the first line of a fold.');

    assert.equal(jobPage.logLines(3).text, 'I am the second line of a fold.');

    assert.equal(jobPage.logLines(4).text, 'I am a line between folds.');

    assert.equal(jobPage.logFolds(0).name, 'afold');
    assert.equal(jobPage.logLines(5).text, 'I am the first line of a second fold.');

    assert.equal(jobPage.logLines(6).text, 'I am the final line.');
  });

  jobPage.logFolds(0).toggle();

  andThen(function () {
    assert.ok(jobPage.logFolds(0).isOpen);
  });
});
