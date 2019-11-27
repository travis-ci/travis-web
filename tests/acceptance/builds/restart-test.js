import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | builds/restart', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('restarting build', function (assert) {
  let repository =  server.create('repository');
  server.create('branch', {});

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', repository, state: 'passed', commit });
  let job = server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
  server.create('log', { id: job.id });

  buildPage
    .visit({ owner: 'travis-ci', repo: 'travis-web', build_id: build.id })
    .restartBuild();

  andThen(() => {
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
