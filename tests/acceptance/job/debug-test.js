import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import jobPage from 'travis/tests/pages/job';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';

module('Acceptance | jobs/debug', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('debugging job', async function (assert) {
    enableFeature('debugBuilds');

    let repo =  server.create('repository', { slug: 'travis-ci/travis-web', private: true });
    let branch = server.create('branch', { name: 'acceptance-tests' });

    let  gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { repository: repo, state: 'failed', commit, branch });
    let job = server.create('job', { number: '1234.1', repository: repo, state: 'failed', commit, build });
    commit.job = job;

    job.save();
    commit.save();

    server.create('log', { id: job.id });

    const requestBodies = [];

    server.post(`/job/${job.id}/debug`, function (schema, request) {
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
