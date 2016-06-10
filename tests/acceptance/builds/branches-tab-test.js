import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import branchesRepoTab from 'travis/tests/pages/repo-tabs/branches';

moduleForAcceptance('Acceptance | builds/branches tab', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

QUnit.only('renders builds tab with inactive build info', function(assert) {
  let repo =  server.create('repository', {slug: 'travis-ci/travis-web'});
  let defaultBranch = server.create('branch', {
    default_branch: true,
    repository: repo
  });
  let activeBranch = server.create('branch', {
    exists_on_github: true,
    repository: repo
  });
  let commit = server.create('commit', {
    author_email: 'mrt@travis-ci.org',
    author_name: 'Mr T',
    committer_email: 'mrt@travis-ci.org',
    committer_name: 'Mr T',
    branch: activeBranch,
    build: build
  });
  let build = server.create('build', {number: '5', repository: repo, state: 'passed', commit_id: commit.id, branch: activeBranch});
  let job = server.create('job', {number: '1234.1', repository: repo, state: 'passed', build_id: build.id, commit_id: commit.id});
  let log = server.create('log', { id: job.id });
  let repoId = parseInt(repo.id);

  server.create('permissions', {
    admin: [repoId],
    push: [repoId],
    pull: [repoId],
    permissions: [repoId],
  });

  branchesRepoTab
    .visit();

  andThen(function() {
    assert.ok(branchesRepoTab.branchesTabActive, 'Branches tab is active when visiting /org/repo/branches');
    assert.ok(branchesRepoTab.inactiveBranchPresent, 'Shows inactive branches');
    pauseTest();
  });
});
