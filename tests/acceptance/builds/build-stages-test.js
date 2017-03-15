import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | build stages');

test('visiting build with stages', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'passed', commit_id: commit.id, commit });

  let firstStage = build.createStage({ number: 1, name: 'first' });
  let secondStage = build.createStage({ number: 2, name: 'second' });

  let firstJob = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build, stage: firstStage });
  commit.job = firstJob;

  firstJob.save();
  commit.save();

  server.create('job', { number: '1234.2', repository_id: repo.id, state: 'passed', build_id: build.id, config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build, stage: firstStage });
  server.create('job', { allow_failure: true, number: '1234.999', repository_id: repo.id, state: 'failed', build_id: build.id, config: { language: 'ruby' }, commit, build, stage: secondStage });

  visit(`/travis-ci/travis-web/builds/${build.id}`);

  andThen(function () {
    assert.equal(buildPage.stages().count, 2, 'expected two build stages');
  });
  percySnapshot(assert);
});
