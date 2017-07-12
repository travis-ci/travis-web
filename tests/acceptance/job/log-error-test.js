import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';

moduleForAcceptance('Acceptance | job/log error');

test('handling log error', function (assert) {
  assert.expect(5);

  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' }),
    branch = server.create('branch', { name: 'acceptance-tests' });

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository, branch, commit, state: 'passed' });
  let job = server.create('job', { repository, commit, build, number: '1234.1', state: 'passed' });

  commit.job = job;

  job.save();
  commit.save();

  visit('/travis-ci/travis-web/jobs/' + job.id);

  waitForElement('.job-log > p');
  andThen(function () {
    assert.equal(jobPage.branch, 'acceptance-tests');
    assert.equal(jobPage.message, 'acceptance-tests This is a message');
    assert.equal(jobPage.state, '#1234.1 passed');
    assert.equal(jobPage.author, 'Mr T authored and committed');

    assert.equal(jobPage.logError, 'There was an error while trying to fetch the log.');
  });
  percySnapshot(assert);
});
