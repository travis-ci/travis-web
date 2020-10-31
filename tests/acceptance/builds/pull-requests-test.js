import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import page from 'travis/tests/pages/build-list';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { settled } from '@ember/test-helpers';
import config from 'travis/config/environment';

const { repoBuildsPerPage } = config.pagination;

module('Acceptance | builds/pull requests', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.currentUser = this.server.create('user', {
      name: 'Travis CI',
      login: 'travis-ci',
    });

    this.branch = this.server.create('branch', { name: 'wetsuwetenstrong' });
    this.server.create('allowance', {subscription_type: 1});

    signInUser(this.currentUser);
  });

  test('renders no pull requests messaging when none present', async function (assert) {
    this.server.create('repository', { owner: { login: 'travis-ci', id: 1 }});

    await page.visitPullRequests({ organization: 'travis-ci', repo: 'travis-web' });

    assert.equal(page.showsNoBuildsMessaging, 'No pull request builds for this repository', 'Pull Requests tab shows no builds message');
  });

  test('view and cancel pull requests', async function (assert) {
    const repository = this.server.create('repository', { owner: { login: 'travis-ci', id: 1 }});
    const request = this.server.create('request', { pull_request_mergeable: 'draft' });

    const pullRequestBuild = this.server.create('build', {
      state: 'started',
      number: '1000',
      finished_at: new Date(),
      started_at: new Date() - 1,
      event_type: 'pull_request',
      pull_request_number: 2010,
      pull_request_title: 'A pull request',
      repository: repository,
      branch: this.branch,
      createdBy: this.currentUser,
      request
    });

    const gitUser = this.server.create('git-user', {
      name: this.currentUser.name
    });

    const pullRequestCommit = pullRequestBuild.createCommit({
      sha: '1234567890',
      author: gitUser,
      committer: gitUser
    });

    for (let i = 0; i < repoBuildsPerPage; i++) {
      let build = this.server.create('build', {
        state: 'passed',
        number: 1000 - i,
        finished_at: new Date() - i * 1000,
        started_at: new Date() - (i + 1) * 1000,
        event_type: 'pull_request',
        pull_request_number: 2010 - i,
        pull_request_title: 'An older pull request',
        repository,
        branch: this.branch,
      });

      build.save();
    }

    pullRequestBuild.save();

    this.server.create('job', {
      number: '1000.1',
      repository,
      state: 'started',
      commit: pullRequestCommit,
      build: pullRequestBuild,
    });

    pullRequestBuild.save();

    await page.visitPullRequests({ organization: 'travis-ci', repo: 'travis-web' });

    assert.equal(page.builds.length, repoBuildsPerPage, 'expected a page of pull request builds');

    page.builds[0].as(pullRequest => {
      assert.ok(pullRequest.started, 'expected the pull request to have started');
      assert.equal(pullRequest.name, 'PR #2010 draft');
      assert.equal(pullRequest.badge, 'draft');
      assert.equal(pullRequest.message, 'A pull request');
      assert.equal(pullRequest.committer, 'Travis CI');
      assert.equal(pullRequest.commitSha, '1234567');

      assert.equal(pullRequest.commitDate.text, 'less than a minute ago');

      assert.equal(pullRequest.duration, '-');

      assert.ok(pullRequest.cancelButton.visible, 'expected the cancel button to be visible');
    });

    percySnapshot(assert);

    await page.builds[0].cancelButton.click();

    assert.equal(topPage.flashMessage.text, 'Build has been successfully cancelled.');

    await settled();

    await page.showMoreButton.click();

    assert.equal(page.builds.length, (repoBuildsPerPage + 1), 'expected another page to have loaded');
  });
});
