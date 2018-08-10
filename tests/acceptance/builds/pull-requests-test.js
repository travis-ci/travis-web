import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/build-list';
import topPage from 'travis/tests/pages/top';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | builds/pull requests', {
  beforeEach() {
    this.currentUser = server.create('user', {
      name: 'Travis CI',
      login: 'travisci',
    });

    signInUser(this.currentUser);

    this.branch = server.create('branch');
  },
});

test('renders no pull requests messaging when none present', function (assert) {
  server.create('repository');

  page.visitPullRequests({ organization: 'travis-ci', repo: 'travis-web' });

  andThen(() => {
    assert.equal(page.showsNoBuildsMessaging, 'No pull request builds for this repository', 'Pull Requests tab shows no builds message');
  });
});

test('view and cancel pull requests', function (assert) {
  const repository = server.create('repository');

  const pullRequestBuild = server.create('build', {
    state: 'started',
    number: '1000',
    finished_at: new Date(),
    started_at: new Date() - 1,
    event_type: 'pull_request',
    pull_request_number: 2010,
    pull_request_title: 'A pull request',
    repository: repository,
    branch: this.branch,
  });

  const gitUser = server.create('git-user', {
    name: this.currentUser.name
  });

  const pullRequestCommit = pullRequestBuild.createCommit({
    sha: '1234567890',
    author: gitUser,
    committer: gitUser
  });

  for (let i = 0; i < 10; i++) {
    let build = server.create('build', {
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

  server.create('job', {
    number: '1000.1',
    repository,
    state: 'started',
    commit: pullRequestCommit,
    build: pullRequestBuild,
  });

  pullRequestBuild.save();

  page.visitPullRequests({ organization: 'travis-ci', repo: 'travis-web' });

  // no idea why this hackery is necessary. Probably somehow related to runloop
  // issues.
  andThen(() => {});

  andThen(() => {
    assert.equal(page.builds.length, 10, 'expected a page of pull request builds');
    page.builds[0].as(pullRequest => {
      assert.ok(pullRequest.started, 'expected the pull request to have started');
      assert.equal(pullRequest.name, 'PR #2010');
      assert.equal(pullRequest.message, 'A pull request');
      assert.equal(pullRequest.committer, 'Travis CI');
      assert.equal(pullRequest.commitSha, '1234567');
      assert.equal(pullRequest.commitDate, 'less than a minute ago');
      assert.equal(pullRequest.duration, '-');

      assert.ok(pullRequest.cancelButton.visible, 'expected the cancel button to be visible');
    });
  });

  percySnapshot(assert);

  page.builds[0].cancelButton.click();

  andThen(() => {
    assert.equal(topPage.flashMessage.text, 'Build has been successfully cancelled.');
  });

  page.showMoreButton.click();

  andThen(() => {
    assert.equal(page.builds.length, 11, 'expected another page to have loaded');
  });
});
