import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';

moduleForAcceptance('Acceptance | job/log error');

test('handling log error', function (assert) {
  const repository =  server.create('repository', { slug: 'travis-ci/travis-web' });
  const branch = server.create('branch', {});

  const commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', message: 'This is a message', branch: 'acceptance-tests', branch_is_default: true });
  const build = server.create('build', { repository, branch, state: 'passed', commit });
  const job = server.create('job', { number: '1234.1', repository, state: 'passed', commit, build_id: build.id });

  visit('/travis-ci/travis-web/jobs/' + job.id);

  andThen(function () {
    assert.equal(jobPage.branch, 'acceptance-tests');
    assert.equal(jobPage.message, 'acceptance-tests This is a message');
    assert.equal(jobPage.state, '#1234.1 passed');
    assert.equal(jobPage.author, 'Mr T authored and committed');

    assert.equal(jobPage.logError, 'There was an error while trying to fetch the log.');
  });
  percySnapshot(assert);
});
