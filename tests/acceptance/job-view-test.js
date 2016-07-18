import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | job view');

test('visiting job-view', function(assert) {

  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  // create branch
  server.create('branch', {});
  let commit = server.create('commit', {author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true});
  let build = server.create('build', {repository_id: repo.id, state: 'passed', commit_id: commit.id, commit});
  let job = server.create('job', {number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit, build});
  commit.job = job;

  job.save();
  commit.save();

  // create log
  server.create('log', { id: job.id });

  visit('/travis-ci/travis-web/jobs/'+ job.id);

  andThen(function() {
    assert.equal(jobPage.branch, 'acceptance-tests');
    assert.equal(jobPage.message, 'acceptance-tests This is a message');
    assert.equal(jobPage.state, '#1234.1 passed');
    assert.equal(jobPage.author, 'Mr T authored and committed');

    assert.equal(jobPage.log, 'Hello log');
  });
});

test('visiting build matrix', function(assert) {
  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  // create branch
  server.create('branch', {});

  let commit = server.create('commit', {author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true});
  let build = server.create('build', {repository_id: repo.id, state: 'passed', commit_id: commit.id, commit});

  let firstJob = server.create('job', {number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, commit, build});
  commit.job = firstJob;

  firstJob.save();
  commit.save();

  let secondJob = server.create('job', {number: '1234.2', repository_id: repo.id, state: 'passed', build_id: build.id, commit, build});
  commit.job = secondJob;

  secondJob.save();
  commit.save();

  visit(`/travis-ci/travis-web/builds/${build.id}`);

  andThen(function() {
    assert.equal(buildPage.jobs().count, 2, 'expected two jobs in the matrix');

    const firstJobRow = buildPage.jobs(0);
    assert.ok(firstJobRow.state.isPassed, 'expected the first job to have passed');
    assert.equal(firstJobRow.number.text, '1234.1');

    const secondJobRow = buildPage.jobs(1);
    assert.equal(secondJobRow.number.text, '1234.2');
  });
});


test('handling log error', function(assert) {
  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  // create branch
  server.create('branch', {});
  let commit = server.create('commit', {author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true});
  let build = server.create('build', {repository_id: repo.id, state: 'passed', commit_id: commit.id, commit});
  let job = server.create('job', {number: '1234.1', reposiptoy_id: repo.id, state: 'passed', build_id: build.id, commit, build});

  commit.job = job;

  job.save();
  commit.save();

  visit('/travis-ci/travis-web/jobs/'+ job.id);

  andThen(function() {
    assert.equal(jobPage.branch, 'acceptance-tests');
    assert.equal(jobPage.message, 'acceptance-tests This is a message');
    assert.equal(jobPage.state, '#1234.1 passed');
    assert.equal(jobPage.author, 'Mr T authored and committed');

    assert.equal(jobPage.logError, 'There was an error while trying to fetch the log.');
  });
});
