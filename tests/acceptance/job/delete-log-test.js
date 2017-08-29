import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';
import topPage from 'travis/tests/pages/top';
import Mirage from 'ember-cli-mirage';

moduleForAcceptance('Acceptance | job/delete log', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);

    let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
    server.create('branch', {});

    let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { repository: repo, state: 'running', commit });
    let job = server.create('job', { number: '1234.1', repository: repo, state: 'running', commit, build });
    commit.job = job;

    job.save();
    commit.save();

    server.create('log', { id: job.id });
  }
});

test('deleting job log when successful', function (assert) {
  assert.expect(2);

  server.patch('/jobs/:id/log', (schema, request) => {
    const job = schema.jobs.find(request.params.id);
    if (job) {
      job.destroy();
      assert.ok(true);
    }
  });

  jobPage
    .visit()
    .deleteLog();

  andThen(() => {
    assert.ok(jobPage.deleteModalAppears, 'Delete modal is shown');
    jobPage.confirmDeleteLog();
  });
});

test('deleting job log when error occurs', function (assert) {
  server.patch('/jobs/:id/log', (schema, request) => {
    return new Mirage.Response(500, {}, {});
  });

  jobPage
    .visit()
    .deleteLog();

  andThen(() => {
    assert.ok(jobPage.deleteModalAppears, 'Delete modal is shown');
  });

  jobPage.confirmDeleteLog();

  andThen(() => {
    assert.ok(topPage.flashMessage.isError, 'Flashes error message');
  });
});
