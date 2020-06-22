import { module, test } from 'qunit';
import { visit, click, triggerKeyEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | builds/prioritize', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user');
    signInUser(currentUser);
  });

  test('prioritizing build button does not exsist if the build is not having permission to prioritize becuase of the organization', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web' });
    let branch = this.server.create('branch', { repository, name: 'acceptance-tests', default_branch: true });
    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, committer_name: 'Mr T', message: 'This is a message' });
    let build = this.server.create('build', { number: '5', state: 'queued', permissions: { 'prioritize': false }, repository, commit, branch, priority: true, });
    let job = this.server.create('job', { number: '1234.1', state: 'queued', repository, commit, build });
    this.server.create('log', { id: job.id });

    await visit('/travis-ci/travis-web');
    assert.dom('[data-test-repo-actions-prioritize-button]').doesNotExist();
  });

  test('prioritizing build button does not exsist if the build is in the finished states', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web' });
    let branch = this.server.create('branch', { repository, name: 'acceptance-tests', default_branch: true });
    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, committer_name: 'Mr T', message: 'This is a message' });
    let build = this.server.create('build', { number: '5', state: 'passed', permissions: { 'prioritize': false }, repository, commit, branch, priority: true, });
    let job = this.server.create('job', { number: '1234.1', state: 'passed', repository, commit, build });
    this.server.create('log', { id: job.id });

    await visit('/travis-ci/travis-web');
    assert.dom('[data-test-repo-actions-prioritize-button]').doesNotExist();
  });

  test('prioritizing build with favouorable conditions', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web' });
    let branch = this.server.create('branch', { repository, name: 'acceptance-tests', default_branch: true });
    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, committer_name: 'Mr T', message: 'This is a message' });
    let build = this.server.create('build', { number: '5', state: 'queued', permissions: { 'prioritize': true }, repository, commit, branch, priority: true, });
    let job = this.server.create('job', { number: '1234.1', state: 'queued', repository, commit, build });
    this.server.create('log', { id: job.id });

    await visit('/travis-ci/travis-web');
    assert.dom('[data-test-repo-actions-prioritize-button]').exists();

    await click('[data-test-repo-actions-prioritize-button]');
    assert.dom('[prioritize-modal-header]').hasText('Prioritize your build');
    assert.dom('[prioritize-checkbox]').exists({ count: 1 });
    assert.dom('[prioritize-checkbox]').hasText('Place build at the top of the queue');
    assert.dom('[prioritize-checkbox-with-cancel]').exists({ count: 1 });
    assert.dom('[prioritize-checkbox-with-cancel]').hasText('Place build at the top of the queue and cancel all running jobs');

    // Checking the Cancel button.
    assert.dom('[prioritize-cancel-button]').hasText('Cancel');
    await click('[prioritize-cancel-button]');
    assert.dom('[prioritize-modal-header]').doesNotExist();

    // Checking the Close button.
    await click('[data-test-repo-actions-prioritize-button]');
    assert.dom('[prioritize-modal-header]').hasText('Prioritize your build');
    assert.dom('[prioritize-close-button]').exists();
    await click('[prioritize-close-button]');
    assert.dom('[prioritize-modal-header]').doesNotExist();

    // Checking the Esc Button Event functionality.
    await click('[data-test-repo-actions-prioritize-button]');
    await triggerKeyEvent('button', 'keydown', 'Escape');
    assert.dom('[prioritize-modal-header]').doesNotExist();

    // Checking the Prioritize build button check.
    await click('[data-test-repo-actions-prioritize-button]');
    assert.dom('[prioritize-button]').hasText('Prioritize build');
    await click('[prioritize-button]');
    assert.dom('[data-test-components-flash-item]').exists();
  });
});
