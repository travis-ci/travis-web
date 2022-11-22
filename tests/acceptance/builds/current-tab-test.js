/* global Travis */
import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | builds/current tab', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {login: 'travis-ci'});
    signInUser(currentUser);
    this.server.create('allowance', {subscription_type: 1});
  });

  test('renders most recent repository without builds', async function (assert) {
    this.server.create('repository', {owner: {login: 'travis-ci', id: 1}});

    await visit('/travis-ci/travis-web');

    assert.dom('[data-test-current-tab-container]').hasClass('active', 'Current tab is active by default when loading dashboard');
    assert.dom('[data-test-missing-notice-header]').hasText('No builds for this repository', 'Current tab shows no builds message');
  });

  test('renders most recent repository and most recent build when builds present, single-job build shows job status instead', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: {login: 'travis-ci', id: 1} });

    const branch = this.server.create('branch', { name: 'acceptance-tests' });
    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { number: '5', state: 'started', repository, branch, commit });
    let job = this.server.create('job', { number: '1234.1', state: 'received', build, commit, repository, config: { language: 'Hello' } });

    commit.update('build', build);
    commit.update('job', job);

    await visit('/travis-ci/travis-web');

    assert.equal(document.title, 'travis-ci/travis-web - Travis CI');
    assert.dom('[data-test-current-tab-container]').hasClass('active', 'Current tab is active by default when loading dashboard');

    assert.dom('[data-test-build-header-build-state]').hasText('#5 booting', 'expected a single-job build’s state to be the job’s state');
    assert.dom('[data-test-build-header]').hasClass('started');

    assert.dom('[data-test-job-log]').exists();
  });

  test('renders the repository and subscribes to private log channel for a private repository', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web', private: true, owner: {login: 'travis-ci', id: 1} });

    const branch = this.server.create('branch', { name: 'acceptance-tests' });
    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { number: '5', state: 'started', repository, branch, commit });
    let job = this.server.create('job', { number: '1234.1', state: 'received', build, commit, repository, config: { language: 'Hello' } });
    this.server.create('log', { id: job.id, content: 'teh log' });

    commit.update('build', build);
    commit.update('job', job);

    await visit('/travis-ci/travis-web');

    assert.dom('[data-test-build-header]').hasClass('started');

    assert.dom('[data-test-job-log-content]').exists('Displays the log');
    assert.ok(Travis.pusher.active_channels.includes(`private-job-${job.id}`));
  });

  test('error message when build jobs array is empty', async function (assert) {
    let repository =  this.server.create('repository', { slug: 'travis-ci/travis-web', owner: {login: 'travis-ci', id: 1} });

    const branch = this.server.create('branch', { name: 'acceptance-tests' });
    let  gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { number: '5', state: 'passed', repository, branch, commit });

    commit.update('build', build);

    await visit('/travis-ci/travis-web');

    assert.dom('[data-test-no-jobs-error-message]').exists();
  });

  test('shows user link to .com if viewing migrated repository on .org', async function (assert) {
    this.server.create('repository', { slug: 'travis-ci/travis-web', active: false, migration_status: 'migrated', owner: {login: 'travis-ci', id: 1}});
    await visit('/travis-ci/travis-web');

    assert.dom('[data-test-not-active-migrated-subtext]').exists();
    assert.dom('[data-test-not-active-migrated-button]').exists();
  });
});
