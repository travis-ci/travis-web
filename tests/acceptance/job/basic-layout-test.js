import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';

import config from 'travis/config/environment';

moduleForAcceptance('Acceptance | job/basic layout');

test('visiting job-view', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  // create branch
  server.create('branch', {});
  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'passed', commit_id: commit.id, commit });
  let job = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit, build });
  commit.job = job;

  job.save();
  commit.save();

  // create log
  server.create('log', { id: job.id });

  visit('/travis-ci/travis-web/jobs/' + job.id);

  andThen(() => {
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
  // create branch
  server.create('branch', {});
  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'passed', commit_id: commit.id, commit });
  let job = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit, build });
  commit.job = job;

  job.save();
  commit.save();

  // create log
  const longLog = new Array(config.logLimit + 1).join('🤔\n');
  server.create('log', { id: job.id, content: longLog });

  visit('/travis-ci/travis-web/jobs/' + job.id);

  // An unfortunate workaround for log displaying being outside Ember facilities.
  //eslint-disable-next-line
  waitForElement('.log-container p.warning');

  andThen(function () {
    assert.ok(jobPage.hasTruncatedLog);
  });

  jobPage.restartJob();

  andThen(() => {
    assert.notOk(jobPage.hasTruncatedLog);
  });
});
