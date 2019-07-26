import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import buildPage from 'travis/tests/pages/build';
import { percySnapshot } from 'ember-percy';

module('Acceptance | job/build matrix', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting build matrix', async function (assert) {
    let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
    let branch = server.create('branch', { name: 'acceptance-tests' });

    let  gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { repository: repo, state: 'passed', commit_id: commit.id, commit, branch });

    let firstJob = server.create('job', { number: '1234.1', repository: repo, state: 'passed', config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build });
    commit.job = firstJob;

    firstJob.save();
    commit.save();

    server.create('job', { number: '1234.2', repository: repo, state: 'passed', config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build });
    server.create('job', { allow_failure: true, number: '1234.999', repository: repo, state: 'failed', config: { language: 'ruby', os: 'jorts' }, commit, build });

    await visit(`/travis-ci/travis-web/builds/${build.id}`);

    assert.equal(buildPage.requiredJobs.length, 2, 'expected two required jobs in the matrix');

    buildPage.requiredJobs[0].as(firstJobRow => {
      assert.ok(firstJobRow.state.isPassed, 'expected the first job to have passed');
      assert.equal(firstJobRow.number, '1234.1');
      assert.equal(firstJobRow.env, 'JORTS');
      assert.ok(firstJobRow.os.isLinux, 'expect Linux');
      assert.equal(firstJobRow.language, 'Node.js: 5');
    });

    buildPage.requiredJobs[1].as(secondJobRow => {
      assert.equal(secondJobRow.number, '1234.2');
      assert.equal(secondJobRow.env, 'JANTS');
      assert.ok(secondJobRow.os.isMacOS, 'expect MacOS');
      assert.equal(secondJobRow.language, 'Ruby: 2.2');
    });

    assert.equal(buildPage.allowedFailureJobs.length, 1, 'expected one allowed failure job');

    buildPage.allowedFailureJobs[0].as(failedJobRow => {
      assert.ok(failedJobRow.state.isFailed, 'expected the allowed failure job to have failed');
      assert.equal(failedJobRow.language, 'Ruby');
      assert.ok(failedJobRow.os.isUnknown, 'expected the job OS to be unknown');
    });
    percySnapshot(assert);
  });
});
