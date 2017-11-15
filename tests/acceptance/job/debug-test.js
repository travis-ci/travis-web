import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import jobPage from 'travis/tests/pages/job';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | jobs/debug', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('debugging job', function (assert) {
  withFeature('pro-version');

  let repo =  server.create('repository', { slug: 'travis-ci/travis-web' });
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

  jobPage
    .visit()
    .debugJob();

  andThen(function () {
    assert.deepEqual(requestBodies.pop(), { quiet: true });
    assert.equal(topPage.flashMessage.text, 'The job was successfully restarted in debug mode but make sure to watch the log for a host to connect to.');
  });
  percySnapshot(assert);
});
