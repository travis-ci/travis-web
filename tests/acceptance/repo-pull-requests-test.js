import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import pullRequestsPage from 'travis/tests/pages/pull-requests';

moduleForAcceptance('Acceptance | repo pull requests', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    const organization = server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    const repository = server.create('repository', {
      name: 'living-a-feminist-life'
    });

    const repoId = parseInt(repository.id);

    const primaryBranch = server.create('branch', {
      name: 'primary',
      id: `/v3/repos/${repoId}/branches/primary`,
      default_branch: true
    });

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const lastBuild = primaryBranch.createBuild({
      state: 'passed',
      number: '1919',
      finished_at: oneYearAgo,
      event_type: 'pull_request',
      pull_request: true,
      pull_request_number: 2010,
      repository_id: repoId,
      pull_request_title: 'A pull request'
    });

    const commitAttributes = {
      sha: '1234567890',
      author_name: currentUser.name
    };

    lastBuild.createCommit(commitAttributes);

    const failedPullRequest = server.create('branch', {
      name: 'failed',
      id: '/v3/repos/${repoId}/branches/failed'
    });

    const failedBuild = failedPullRequest.createBuild({
      state: 'failed',
      event_type: 'pull_request',
      pull_request: true,
      repository_id: repoId
    });

    failedBuild.createCommit(commitAttributes);

    const erroredPullRequest = server.create('branch', {
      name: 'errored',
      id: '/v3/repos/${repoId}/branches/errored'
    });

    const erroredBuild = erroredPullRequest.createBuild({
      state: 'errored',
      event_type: 'pull_request',
      pull_request: true,
      repository_id: repoId
    });

    erroredBuild.createCommit(commitAttributes);
  }
});

test('view pull requests', function(assert) {
  pullRequestsPage.visit({organization: 'killjoys', repo: 'living-a-feminist-life'});

  andThen(() => {
    assert.equal(pullRequestsPage.pullRequests().count, 3, 'expected three pull requests');

    const pullRequest = pullRequestsPage.pullRequests(0);

    assert.ok(pullRequest.passed, 'expected the first pull request to have passed');
    assert.equal(pullRequest.name, 'PR #2010 A pull request');
    assert.equal(pullRequest.committer, 'Sara Ahmed');
    assert.equal(pullRequest.commitSha, '1234567');
    assert.equal(pullRequest.commitDate, 'about a year ago');

    assert.ok(pullRequestsPage.pullRequests(1).failed, 'expected the second pull request to have failed');
    assert.ok(pullRequestsPage.pullRequests(2).errored, 'expected the third pull request to have errored');
  });
});
