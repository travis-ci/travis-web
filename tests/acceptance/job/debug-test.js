import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';

moduleForAcceptance('Acceptance | jobs/debug', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('debugging job', function (assert) {
  withFeature('pro-version');

  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { repository_id: repo.id, state: 'failed', commit_id: commit.id, commit });
  let job = server.create('job', { number: '1234.1', repository_id: repo.id, state: 'failed', build_id: build.id, commit, build });
  commit.job = job;

  job.save();
  commit.save();

  server.create('log', { id: job.id });

  const requestBodies = [];

  server.post(`/job/${job.id}/debug`, function (schema, request) {
    const parsedRequestBody = JSON.parse(request.requestBody);
    requestBodies.push(parsedRequestBody);
  });

  jobPage
    .visit()
    .debugJob();

  andThen(function () {
    assert.deepEqual(requestBodies.pop(), { quiet: true });
    assert.equal(jobPage.notification, 'The job was successfully restarted in debug mode. Watch the log for a host to connect to.');
  });
  percySnapshot(assert);
});
