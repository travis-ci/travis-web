import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | builds/debug', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('debugging single-job build', function (assert) {
  withFeature('pro-version');

  let repository =  server.create('repository');
  server.create('branch', {});

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', repository, state: 'passed', commit });
  let job = server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
  server.create('log', { id: job.id });

  const requestBodies = [];

  server.post(`/job/${job.id}/debug`, function (schema, request) {
    const parsedRequestBody = JSON.parse(request.requestBody);
    requestBodies.push(parsedRequestBody);
  });

  buildPage
    .visit({ owner: 'travis-ci', repo: 'travis-web', build_id: build.id })
    .debugBuild();

  andThen(function () {
    assert.deepEqual(requestBodies.pop(), { quiet: true });
    assert.equal(topPage.flashMessage.text, 'The build was successfully restarted in debug mode but make sure to watch the log for a host to connect to.');
  });
});

test('multi-job builds cannot be debugged', function (assert) {
  withFeature('pro-version');

  let repository =  server.create('repository');
  server.create('branch', {});

  let  gitUser = server.create('git-user', { name: 'Mr T' });
  let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', repository, state: 'passed', commit });
  server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
  server.create('job', { number: '1234.2', repository, state: 'passed', build, commit });

  buildPage
    .visit({ owner: 'travis-ci', repo: 'travis-web', build_id: build.id });

  andThen(() => {
    assert.ok(buildPage.hasNoDebugButton);
  });
});
