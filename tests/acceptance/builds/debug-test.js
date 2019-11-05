import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | builds/debug', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('debugging single-job build', async function (assert) {
    enableFeature('debug-builds');

    let repository =  server.create('repository', {
      private: true
    });

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

    await visit(`/travis-ci/travis-web/builds/${build.id}`);
    await click('[data-test-repo-actions-debug-button]');

    assert.deepEqual(requestBodies.pop(), { quiet: true });
    assert.dom('[data-test-flash-message-text]').hasText('The build was successfully restarted in debug mode but make sure to watch the log for a host to connect to.');
  });

  test('multi-job builds cannot be debugged', async function (assert) {
    enableFeature('debug-builds');

    let repository =  server.create('repository');
    server.create('branch', {});

    let  gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { number: '5', repository, state: 'passed', commit });
    server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
    server.create('job', { number: '1234.2', repository, state: 'passed', build, commit });

    await visit(`/travis-ci/travis-web/builds/${build.id}`);

    assert.dom('[data-test-repo-actions-debug-button]').doesNotExist();
  });
});
