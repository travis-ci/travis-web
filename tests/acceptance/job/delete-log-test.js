import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import jobPage from 'travis/tests/pages/job';
import topPage from 'travis/tests/pages/top';
import { Response } from 'ember-cli-mirage';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | job/delete log', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);

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
  });

  test('deleting job log when successful', async function (assert) {
    assert.expect(2);

    server.delete('/job/:id/log', (schema, request) => {
      const job = schema.jobs.find(request.params.id);
      if (job) {
        job.destroy();
        assert.ok(true);
      }
    });

    await jobPage
      .visit()
      .deleteLog();

    assert.ok(jobPage.deleteModalAppears, 'Delete modal is shown');
    await jobPage.confirmDeleteLog();
  });

  test('deleting job log when error occurs', async function (assert) {
    server.delete('/job/:id/log', (schema, request) => {
      return new Response(500, {}, {});
    });

    await jobPage
      .visit()
      .deleteLog();

    assert.ok(jobPage.deleteModalAppears, 'Delete modal is shown');

    await jobPage.confirmDeleteLog();

    assert.ok(topPage.flashMessage.isError, 'Flashes error message');
  });
});
