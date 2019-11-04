import { module, test } from 'qunit';
import { settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import jobPage from 'travis/tests/pages/job';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | jobs/cancel', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('restarting job', async function (assert) {
    let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
    server.create('branch', {});

    let  gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { repository: repo, state: 'running', commit });
    let job = server.create('job', { number: '1234.1', repository: repo, state: 'running', commit, build });
    commit.job = job;

    job.save();
    commit.save();

    server.create('log', { id: job.id });

    await jobPage
      .visit()
      .cancelJob();
    await settled();

    assert.equal(topPage.flashMessage.text, 'Job has been successfully cancelled.', 'cancelled job notification should be displayed');
  });
});
