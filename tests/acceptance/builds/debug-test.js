import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import buildPage from 'travis/tests/pages/build';

moduleForAcceptance('Acceptance | builds/debug', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('debugging single-job build', function (assert) {
  withFeature('pro-version');

  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', repository, state: 'passed', commit });
  let job = server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
  server.create('log', { id: job.id });

  const requestBodies = [];

  server.post(`/job/${job.id}/debug`, function (schema, request) {
    const parsedRequestBody = JSON.parse(request.requestBody);
    requestBodies.push(parsedRequestBody);
  });

  buildPage
    .visit({ slug: 'travis-ci/travis-web', build_id: build.id })
    .debugBuild();

  andThen(function () {
    assert.deepEqual(requestBodies.pop(), { quiet: true });
    assert.equal(buildPage.notification, 'The build was successfully restarted in debug mode. Watch the log for a host to connect to.');
  });
});

test('multi-job builds cannot be debugged', function (assert) {
  withFeature('pro-version');

  let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });
  server.create('branch', {});

  let commit = server.create('commit', { author_email: 'mrt@travis-ci.org', author_name: 'Mr T', committer_email: 'mrt@travis-ci.org', committer_name: 'Mr T', branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
  let build = server.create('build', { number: '5', repository, state: 'passed', commit });
  server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
  server.create('job', { number: '1234.2', repository, state: 'passed', build, commit });

  buildPage
    .visit({ slug: 'travis-ci/travis-web', build_id: build.id });

  andThen(() => {
    assert.ok(buildPage.hasNoDebugButton);
  });
});
