import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import jobPage from 'travis/tests/pages/job';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | jobs/debug', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('debugging job', async function (assert) {
    enableFeature('debugBuilds');

    const currentUser = this.server.create('user', { confirmed_at: Date.now() });
    this.server.create('allowance', {subscription_type: 1});
    this.server.create('user', {login: 'travis-ci'});
    this.server.create('allowance', {subscription_type: 1});
    signInUser(currentUser);

    let repo =  this.server.create('repository', { slug: 'travis-ci/travis-web', private: true, owner: { login: 'travis-ci', id: 1 } });
    let branch = this.server.create('branch', { name: 'acceptance-tests' });

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repo, state: 'failed', commit, branch });
    let job = this.server.create('job', { number: '1234.1', repository: repo, state: 'failed', commit, build });
    commit.job = job;

    job.save();
    commit.save();

    this.server.create('log', { id: job.id });

    const requestBodies = [];

    this.server.post(`/job/${job.id}/debug`, function (schema, request) {
      const parsedRequestBody = JSON.parse(request.requestBody);
      requestBodies.push(parsedRequestBody);
    });

    await jobPage
      .visit()
      .debugJob();

    assert.deepEqual(requestBodies.pop(), { quiet: true });
    assert.equal(topPage.flashMessage.text, 'The job was successfully restarted in debug mode but make sure to watch the log for a host to connect to.');
    percySnapshot(assert);
  });
});
