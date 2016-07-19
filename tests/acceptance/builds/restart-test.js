import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | builds/restart', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('restarting build', function (assert) {
  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });
  // create branch
  server.create('branch', {});
  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', repository_id: repository.id, state: 'passed', commit_id: commit.id, commit });
  let job = server.create('job', { number: '1234.1', repository_id: repository.id, state: 'passed', build, commit_id: commit.id });
  // create log
  server.create('log', { id: job.id });

  buildPage
    .visit()
    .restartBuild();

  andThen(function () {
    assert.equal(buildPage.restartedNotification, 'The build was successfully restarted.', 'restarted notification should display proper build restarted text');
    assert.equal(buildPage.singleJobLogText, 'Hello log', 'shows log text of single build job');
  });
});
