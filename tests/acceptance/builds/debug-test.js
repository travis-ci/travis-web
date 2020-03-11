import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | builds/debug', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user');
    signInUser(currentUser);
  });

  test('debugging single-job build', async function (assert) {
    enableFeature('debug-builds');

    let repository =  this.server.create('repository', {
      private: true
    });

    this.server.create('branch', {});

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { number: '5', repository, state: 'passed', commit });
    let job = this.server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
    this.server.create('log', { id: job.id });

    const requestBodies = [];

    this.server.post(`/job/${job.id}/debug`, function (schema, request) {
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

    let repository =  this.server.create('repository');
    this.server.create('branch', {});

    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { number: '5', repository, state: 'passed', commit });
    this.server.create('job', { number: '1234.1', repository, state: 'passed', build, commit });
    this.server.create('job', { number: '1234.2', repository, state: 'passed', build, commit });

    await visit(`/travis-ci/travis-web/builds/${build.id}`);

    assert.dom('[data-test-repo-actions-debug-button]').doesNotExist();
  });
});
