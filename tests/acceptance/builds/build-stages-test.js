import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | build stages');

const jobTime = new Date();

function futureTime(secondsAhead) {
  return new Date(jobTime.getTime() + secondsAhead * 1000);
}

test('visiting build with one stage', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });

  let branch = server.create('branch', { name: 'acceptance-tests' });
  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository: repo, state: 'passed', commit, branch });

  let firstStage = build.createStage({ number: 1, name: 'first :two_men_holding_hands:', state: 'passed', started_at: jobTime, finished_at: futureTime(71), allow_failure: true });

  let firstJob = server.create('job', { number: '1234.1', repository: repo, state: 'passed', config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build, stage: firstStage, started_at: jobTime, finished_at: futureTime(30) });
  commit.job = firstJob;

  firstJob.save();
  commit.save();

  server.create('job', { number: '1234.2', repository: repo, state: 'failed', allow_failure: true, config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build, stage: firstStage, started_at: jobTime, finished_at: futureTime(40) });

  visit(`/travis-ci/travis-web/builds/${build.id}`);

  // TODO: I'm not sure why it's needed now
  waitForElement('.jobs.stage .stage-header.passed');

  andThen(function () {
    assert.equal(buildPage.stages.length, 1, 'expected one build stage');

    buildPage.stages[0].as(stage => {
      assert.ok(stage.isPassed);
    });
  });

  percySnapshot(assert);
});

test('visiting build with stages and an unknown config message', function (assert) {
  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });

  let request = server.create('request');
  server.create('message', {
    request,
    level: 'info',
    key: 'jortleby',
    code: 'skortleby',
    args: {
      jortle: 'tortle'
    }
  });

  let build = server.create('build', { repository: repo, state: 'passed', commit_id: commit.id, commit, request });

  let secondStage = build.createStage({ number: 2, name: 'second', state: 'failed', started_at: jobTime, finished_at: futureTime(11) });
  let firstStage = build.createStage({ number: 1, name: 'first :two_men_holding_hands:', state: 'passed', started_at: jobTime, finished_at: futureTime(71), allow_failure: true });

  let firstJob = server.create('job', { number: '1234.1', repository: repo, state: 'passed', config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build, stage: firstStage, started_at: jobTime, finished_at: futureTime(30) });
  commit.job = firstJob;

  firstJob.save();
  commit.save();

  server.create('job', { number: '1234.2', repository: repo, state: 'failed', allow_failure: true, config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build, stage: firstStage, started_at: jobTime, finished_at: futureTime(40) });
  server.create('job', { number: '1234.999', repository: repo, state: 'failed', config: { language: 'ruby' }, commit, build, stage: secondStage, started_at: jobTime, finished_at: futureTime(10) });

  visit(`/travis-ci/travis-web/builds/${build.id}`);

  // TODO: I'm not sure why it's needed now
  waitForElement('.jobs.stage .stage-header.passed');

  andThen(function () {
    assert.equal(buildPage.stages.length, 2, 'expected two build stages');

    assert.equal(buildPage.ymlMessages.length, 1, 'expected one yml message');

    buildPage.ymlMessages[0].as(info => {
      assert.ok(info.icon.isInfo, 'expected the yml message to be an info');
      assert.equal(info.message, 'unrecognised message code skortleby');
    });

    buildPage.stages[0].as(stage => {
      assert.equal(stage.name, 'first', 'expected the stages to be numerically sorted');
      assert.equal(stage.nameEmojiTitle, 'two_men_holding_hands');
      assert.ok(stage.isPassed);
      assert.equal(stage.stateTitle, 'Stage passed');
      assert.equal(stage.duration, '1 min 11 sec');
      assert.equal(stage.jobs[0].number, '1234.1');
      assert.equal(stage.jobs[1].number, '1234.2');
      assert.equal(stage.allowFailures.text, 'Your build matrix was set to allow the failure of job 1234.2 so we continued this build to the next stage.');
    });

    buildPage.stages[1].as(stage => {
      assert.equal(stage.name, 'second');
      assert.ok(stage.isFailed);
      assert.equal(stage.stateTitle, 'Stage failed');
      assert.equal(stage.duration, '11 sec');
      assert.equal(stage.jobs[0].number, '1234.999');
      assert.ok(stage.allowFailures.isHidden, 'expected no allowed failures text');
    });
  });
  percySnapshot(assert);
});
