import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | build stages');

const jobTime = new Date();

function futureTime(secondsAhead) {
  return new Date(jobTime.getTime() + secondsAhead * 1000);
}

test('visiting build with stages', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'passed', commit_id: commit.id, commit });

  let secondStage = build.createStage({ number: 2, name: 'second' });
  let firstStage = build.createStage({ number: 1, name: 'first :two_men_holding_hands:' });

  let firstJob = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build, stage: firstStage, startedAt: jobTime, finishedAt: futureTime(30) });
  commit.job = firstJob;

  firstJob.save();
  commit.save();

  server.create('job', { number: '1234.2', repository_id: repo.id, state: 'passed', build_id: build.id, config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build, stage: firstStage, startedAt: jobTime, finishedAt: futureTime(40) });
  server.create('job', { allow_failure: true, number: '1234.999', repository_id: repo.id, state: 'failed', build_id: build.id, config: { language: 'ruby' }, commit, build, stage: secondStage, startedAt: jobTime, finishedAt: futureTime(10) });

  visit(`/travis-ci/travis-web/builds/${build.id}`);

  andThen(function () {
    assert.equal(buildPage.stages().count, 2, 'expected two build stages');

    assert.equal(buildPage.stages(0).name, 'first', 'expected the stages to be numerically sorted');
    assert.equal(buildPage.stages(0).nameEmojiTitle, 'two_men_holding_hands');
    assert.ok(buildPage.stages(0).isPassed);
    assert.equal(buildPage.stages(0).duration, '1 min 10 sec');
    assert.equal(buildPage.stages(0).jobs(0).number, '1234.1');
    assert.equal(buildPage.stages(0).jobs(1).number, '1234.2');

    assert.equal(buildPage.stages(1).name, 'second');
    assert.ok(buildPage.stages(1).isFailed);
    assert.equal(buildPage.stages(1).duration, '10 sec');
    assert.equal(buildPage.stages(1).jobs(0).number, '1234.999');
  });
  percySnapshot(assert);
});
