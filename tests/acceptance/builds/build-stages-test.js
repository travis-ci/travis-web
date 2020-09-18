import { visit, waitFor } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import buildPage from 'travis/tests/pages/build';
import { prettyDate } from 'travis/helpers/pretty-date';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | build stages', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  const jobTime = new Date();

  function futureTime(secondsAhead) {
    return new Date(jobTime.getTime() + secondsAhead * 1000);
  }

  test('visiting build with one stage', async function (assert) {
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repo =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1} });

    let branch = this.server.create('branch', { name: 'acceptance-tests' });
    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repo, state: 'passed', commit, branch });

    let firstStage = build.createStage({ number: 1, name: 'first :two_men_holding_hands:', state: 'passed', started_at: jobTime, finished_at: futureTime(71), allow_failure: true });

    let firstJob = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build, stage: firstStage, started_at: jobTime, finished_at: futureTime(30) });
    commit.job = firstJob;

    firstJob.save();
    commit.save();

    this.server.create('job', { number: '1234.2', repository: repo, state: 'failed', allow_failure: true, config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build, stage: firstStage, started_at: jobTime, finished_at: futureTime(40) });

    await visit(`/travis-ci/travis-web/builds/${build.id}`);

    // TODO: I'm not sure why it's needed now
    await waitFor('.jobs.stage .stage-header.passed');

    assert.equal(buildPage.stages.length, 1, 'expected one build stage');

    buildPage.stages[0].as(stage => {
      assert.ok(stage.isPassed);
    });

    percySnapshot(assert);
  });

  test('visiting build with stages', async function (assert) {
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    let repo =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1} });

    this.server.create('branch', {});

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });

    let request = this.server.create('request');

    let build = this.server.create('build', { repository: repo, state: 'passed', commit_id: commit.id, commit, request });

    let secondStage = build.createStage({ number: 2, name: 'second', state: 'failed', started_at: jobTime, finished_at: futureTime(11) });
    let firstStage = build.createStage({ number: 1, name: 'first :two_men_holding_hands:', state: 'passed', started_at: jobTime, finished_at: futureTime(71), allow_failure: true });

    let firstJob = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build, stage: firstStage, started_at: jobTime, finished_at: futureTime(30) });
    commit.job = firstJob;

    firstJob.save();
    commit.save();

    this.server.create('job', { number: '1234.2', repository: repo, state: 'failed', allow_failure: true, config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build, stage: firstStage, started_at: jobTime, finished_at: futureTime(40) });
    this.server.create('job', { number: '1234.999', repository: repo, state: 'failed', config: { language: 'ruby' }, commit, build, stage: secondStage, started_at: jobTime, finished_at: futureTime(10) });

    await visit(`/travis-ci/travis-web/builds/${build.id}`);

    // TODO: I'm not sure why it's needed now
    await waitFor('.jobs.stage .stage-header.passed');

    assert.equal(buildPage.stages.length, 2, 'expected two build stages');

    buildPage.stages[0].as(stage => {
      assert.equal(stage.name, 'first', 'expected the stages to be numerically sorted');
      assert.equal(stage.nameEmojiTitle, 'two_men_holding_hands');
      assert.ok(stage.isPassed);
      assert.equal(stage.stateTitle, 'Stage passed');

      assert.equal(stage.duration.text, '1 min 11 sec');
      assert.equal(stage.duration.title, `Started ${prettyDate([jobTime])}`);

      assert.equal(stage.jobs[0].number, '1234.1');
      assert.equal(stage.jobs[1].number, '1234.2');
      assert.equal(stage.allowFailures.text, 'Your build matrix was set to allow the failure of job 1234.2 so we continued this build to the next stage.');
    });

    buildPage.stages[1].as(stage => {
      assert.equal(stage.name, 'second');
      assert.ok(stage.isFailed);
      assert.equal(stage.stateTitle, 'Stage failed');

      assert.equal(stage.duration.text, '11 sec');
      assert.equal(stage.duration.title, `Started ${prettyDate([jobTime])}`);

      assert.equal(stage.jobs[0].number, '1234.999');
      assert.ok(stage.allowFailures.isHidden, 'expected no allowed failures text');
    });
    percySnapshot(assert);
  });
});
