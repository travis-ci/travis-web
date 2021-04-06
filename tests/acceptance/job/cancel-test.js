import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import jobPage from 'travis/tests/pages/job';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | jobs/cancel', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {login: 'travis-ci', confirmed_at: Date.now()});
    this.server.create('allowance', {subscription_type: 1});
    signInUser(currentUser);
  });

  test('restarting job', async function (assert) {
    let repo =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: { login: 'travis-ci', id: 1 } });
    this.server.create('branch', {});

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repo, state: 'running', commit });
    let job = this.server.create('job', { number: '1234.1', repository: repo, state: 'running', commit, build });
    commit.job = job;

    job.save();
    commit.save();

    this.server.create('log', { id: job.id });

    await jobPage
      .visit()
      .cancelJob();

    assert.equal(topPage.flashMessage.text, 'Job has been successfully cancelled.', 'cancelled job notification should be displayed');
  });
});
