import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/build-list';

moduleForAcceptance('Acceptance | builds/pull requests', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Travis CI',
      login: 'travisci',
    });

    signInUser(currentUser);

    const repository = server.create('repository', {
      slug: 'travis-ci/travis-web'
    });

    const pullRequestBuild = server.create('build', {
      state: 'started',
      number: '1000',
      finished_at: new Date(),
      started_at: new Date() - 1,
      event_type: 'pull_request',
      pull_request_number: 2010,
      pull_request_title: 'A pull request',
      repositoryId: repository.id,
      branch: this.branch,
    });

    const pullRequestCommit = pullRequestBuild.createCommit({
      sha: '1234567890',
      author_name: currentUser.name,
      author_email: currentUser.email,
      committer_name: currentUser.name,
      committer_email: currentUser.email,
    });
    pullRequestBuild.save();

    server.create('job', {
      number: '1000.1',
      repositoryId: this.repoId,
      state: 'started',
      commit_id: pullRequestCommit.id,
      buildId: pullRequestBuild.id,
    });

    pullRequestBuild.save();
  },
});

test('view and cancel pull requests', function (assert) {
  page.visitPullRequests({ organization: 'travis-ci', repo: 'travis-web' });

  // no idea why this hackery is necessary. Probably somehow related to runloop
  // issues.
  andThen(() => {});

  andThen(() => {
    assert.equal(page.builds().count, 1, 'expected one pull request build');

    const pullRequest = page.builds(0);

    assert.ok(pullRequest.started, 'expected the pull request to have started');
    assert.equal(pullRequest.name, 'PR #2010');
    assert.equal(pullRequest.message, 'A pull request');
    assert.equal(pullRequest.committer, 'Travis CI');
    assert.equal(pullRequest.commitSha, '1234567');
    assert.equal(pullRequest.commitDate, 'less than a minute ago');
    assert.equal(pullRequest.duration, '-');

    assert.ok(pullRequest.cancelButton.visible, 'expected the cancel button to be visible');
  });

  percySnapshot(assert);

  page.builds(0).cancelButton.click();

  andThen(() => {
    assert.equal(page.notification, 'Build has been successfully cancelled.');
  });
});
