import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import buildPage from 'travis/tests/pages/build';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | builds/restart', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('restarting build', async function (assert) {
    const currentUser = this.server.create('user', {login: 'travis-ci', confirmed_at: Date.now()});
    this.server.create('allowance', {subscription_type: 1});
    signInUser(currentUser);

    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1} });

    this.server.create('branch', {});

    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { number: '5', repository, state: 'passed', commit });
    let job = this.server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
    this.server.create('log', { id: job.id });

    await buildPage
      .visit({ owner: 'travis-ci', repo: 'travis-web', build_id: build.id })
      .restartBuild();

    assert.equal(topPage.flashMessage.text, 'The build was successfully restarted.', 'restarted notification should display proper build restarted text');

    const logNumbers = buildPage.singleJobLogText.match(/\d+/g);
    const logContent = buildPage.singleJobLogText.split(/\d+/g).filter(Boolean);

    assert.equal(logNumbers.length, 2, 'counts lines of log text of single build job');
    assert.equal(logNumbers[0], '1', 'shows number of first line of log text of single build job');
    assert.equal(logContent[0], 'Hello log', 'shows content of first line of log text of single build job');
    assert.equal(logNumbers[1], '2', 'shows number of second line of log text of single build job');
    assert.equal(logContent[1], 'Second line', 'shows content of second line of log text of single build job');
  });
});
