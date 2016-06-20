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

    lastBuild.createCommit({
      sha: '1234567890',
      committer: currentUser,
      author_name: currentUser.name
    });
  }
});

test('view pull requests', function(assert) {
  pullRequestsPage.visit({organization: 'killjoys', repo: 'living-a-feminist-life'});

  andThen(() => {
    assert.equal(pullRequestsPage.pullRequests.length, 1, 'expected one pull request');

    const pullRequest = pullRequestsPage.pullRequests(0);

    assert.ok(pullRequest.passed, 'expected pull request to have passed');
    assert.equal(pullRequest.name, 'PR #2010 A pull request');
    assert.equal(pullRequest.committer, 'Sara Ahmed');
    assert.equal(pullRequest.commitSha, '1234567');
    assert.equal(pullRequest.commitDate, 'about a year ago');
  });
});
