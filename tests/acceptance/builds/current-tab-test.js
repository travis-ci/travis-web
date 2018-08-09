/* global Travis */
import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';

module('Acceptance | builds/current tab', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);
  });

  test('renders most recent repository without builds', async function (assert) {
    server.create('repository');

    await visit('/travis-ci/travis-web');

    assert.dom('[data-test-current-tab-container]').hasClass('active', 'Current tab is active by default when loading dashboard');
    assert.dom('[data-test-missing-notice-header]').hasText('No builds for this repository', 'Current tab shows no builds message');
  });

  test('renders most recent repository and most recent build when builds present, single-job build shows job status instead', async function (assert) {
    let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

    const branch = server.create('branch', { name: 'acceptance-tests' });
    let commit = server.create('commit', { branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { number: '5', state: 'started', repository, branch, commit });
    let job = server.create('job', { number: '1234.1', state: 'received', build, commit, repository, config: { language: 'Hello' } });

    commit.update('build', build);
    commit.update('job', job);

    await visit('/travis-ci/travis-web');

    assert.equal(document.title, 'travis-ci/travis-web - Travis CI');
    assert.dom('[data-test-current-tab-container]').hasClass('active', 'Current tab is active by default when loading dashboard');

    assert.dom('[data-test-build-header-build-state]').hasText('#5 booting', 'expected a single-job build’s state to be the job’s state');
    assert.dom('[data-test-build-header]').hasClass('started');

    assert.dom('[data-test-job-log]').exists();
    assert.dom('[data-test-job-config-content]').doesNotExist('Job config is hidden');
    await click('[data-test-job-config-tab]');

    assert.dom('[data-test-job-config-content]').exists();
    assert.dom('[data-test-job-config-content]').hasText('{ \"language\": \"Hello\" }');
    assert.dom('[data-test-job-log-content]').doesNotExist();

    percySnapshot(assert);
  });

  test('renders the repository and subscribes to private log channel for a private repository', async function (assert) {
    let repository =  server.create('repository', { slug: 'travis-ci/travis-web', private: true });

    const branch = server.create('branch', { name: 'acceptance-tests' });
    let commit = server.create('commit', { branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { number: '5', state: 'started', repository, branch, commit });
    let job = server.create('job', { number: '1234.1', state: 'received', build, commit, repository, config: { language: 'Hello' } });
    server.create('log', { id: job.id, content: 'teh log' });

    commit.update('build', build);
    commit.update('job', job);

    await visit('/travis-ci/travis-web');

    assert.dom('[data-test-build-header]').hasClass('started');

    assert.dom('[data-test-job-log-content]').exists('Displays the log');
    assert.ok(Travis.pusher.active_channels.includes(`private-job-${job.id}`));
  });

  test('error message when build jobs array is empty', async function (assert) {
    let repository =  server.create('repository', { slug: 'travis-ci/travis-web' });

    const branch = server.create('branch', { name: 'acceptance-tests' });
    let commit = server.create('commit', { branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { number: '5', state: 'passed', repository, branch, commit });

    commit.update('build', build);

    await visit('/travis-ci/travis-web');

    assert.dom('[data-test-no-jobs-error-message]').exists();

    percySnapshot(assert);
  });
});
