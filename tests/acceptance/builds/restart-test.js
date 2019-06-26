import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import buildPage from 'travis/tests/pages/build';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | builds/restart', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('restarting build', async function (assert) {
    let repository =  server.create('repository');
    server.create('branch', {});

    let  gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { number: '5', repository, state: 'passed', commit });
    let job = server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
    server.create('log', { id: job.id });

    await buildPage
      .visit({ owner: 'travis-ci', repo: 'travis-web', build_id: build.id })
      .restartBuild();

    assert.equal(topPage.flashMessage.text, 'The build was successfully restarted.', 'restarted notification should display proper build restarted text');
    assert.equal(buildPage.singleJobLogText, 'Hello log', 'shows log text of single build job');
  });
});
