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

  let secondStage = build.createStage({ number: 2, name: 'second', state: 'failed', started_at: jobTime, finished_at: futureTime(11) });
  let firstStage = build.createStage({ number: 1, name: 'first :two_men_holding_hands:', state: 'passed', started_at: jobTime, finished_at: futureTime(71), allow_failure: true });

  let firstJob = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'passed', build_id: build.id, config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build, stage: firstStage, startedAt: jobTime, finishedAt: futureTime(30) });
  commit.job = firstJob;

  firstJob.save();
  commit.save();

  server.create('job', { number: '1234.2', repository_id: repo.id, state: 'failed', allow_failure: true, build_id: build.id, config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build, stage: firstStage, startedAt: jobTime, finishedAt: futureTime(40) });
  server.create('job', { number: '1234.999', repository_id: repo.id, state: 'failed', build_id: build.id, config: { language: 'ruby' }, commit, build, stage: secondStage, startedAt: jobTime, finishedAt: futureTime(10) });

  visit(`/travis-ci/travis-web/builds/${build.id}`);

  andThen(function () {
    assert.equal(buildPage.stages().count, 2, 'expected two build stages');

    buildPage.stages(0).as(stage => {
      assert.equal(stage.name, 'first', 'expected the stages to be numerically sorted');
      assert.equal(stage.nameEmojiTitle, 'two_men_holding_hands');
      assert.ok(stage.isPassed);
      assert.equal(stage.stateTitle, 'Stage passed');
      assert.equal(stage.duration, '1 min 11 sec');
      assert.equal(stage.jobs(0).number, '1234.1');
      assert.equal(stage.jobs(1).number, '1234.2');
      assert.equal(stage.allowFailures.text, 'Your build matrix was set to allow the failure of job 1234.2 so we continued this build to the next stage.');
    });

    buildPage.stages(1).as(stage => {
      assert.equal(stage.name, 'second');
      assert.ok(stage.isFailed);
      assert.equal(stage.stateTitle, 'Stage failed');
      assert.equal(stage.duration, '11 sec');
      assert.equal(stage.jobs(0).number, '1234.999');
      assert.ok(stage.allowFailures.isHidden, 'expected no allowed failures text');
    });
  });
  percySnapshot(assert);
});
