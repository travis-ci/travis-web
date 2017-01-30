import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | job/build matrix');

test('visiting build matrix', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'passed', commit_id: commit.id, commit });

  let firstJob = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build });
  commit.job = firstJob;

  firstJob.save();
  commit.save();

  server.create('job', { number: '1234.2', repository_id: repo.id, state: 'passed', build_id: build.id, config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build });
  server.create('job', { allow_failure: true, number: '1234.999', repository_id: repo.id, state: 'failed', build_id: build.id, config: { language: 'ruby' }, commit, build });

  visit(`/travis-ci/travis-web/builds/${build.id}`);

  andThen(function () {
    assert.equal(buildPage.requiredJobs().count, 2, 'expected two required jobs in the matrix');

    const firstJobRow = buildPage.requiredJobs(0);
    assert.ok(firstJobRow.state.isPassed, 'expected the first job to have passed');
    assert.equal(firstJobRow.number, '1234.1');
    assert.equal(firstJobRow.env, 'JORTS');
    assert.ok(firstJobRow.os.isLinux, 'expect Linux');
    assert.equal(firstJobRow.language, 'Node.js: 5');

    const secondJobRow = buildPage.requiredJobs(1);
    assert.equal(secondJobRow.number, '1234.2');
    assert.equal(secondJobRow.env, 'JANTS');
    assert.ok(secondJobRow.os.isMacOS, 'expect MacOS');
    assert.equal(secondJobRow.language, 'Ruby: 2.2');

    assert.equal(buildPage.allowedFailureJobs().count, 1, 'expected one allowed failure job');

    const failedJobRow = buildPage.allowedFailureJobs(0);
    assert.ok(failedJobRow.state.isFailed, 'expected the allowed failure job to have failed');
    assert.equal(failedJobRow.language, 'Ruby');
  });
  percySnapshot(assert);
});
