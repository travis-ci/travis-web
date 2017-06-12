import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import branchesPage from 'travis/tests/pages/branches';

moduleForAcceptance('Acceptance | repo branches', {
  beforeEach() {
    this.currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(this.currentUser);

    const gitUser = server.create('git-user', {
      name: 'Sara Ahmed'
    });

    // create organization
    server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    const repository = server.create('repository', {
      name: 'living-a-feminist-life',
      slug: 'killjoys/living-a-feminist-life'
    });

    const repoId = parseInt(repository.id);

    const primaryBranch = server.create('branch', {
      name: 'primary',
      id: `/v3/repos/${repoId}/branches/primary`,
      default_branch: true,
      repository,
    });

    let currentBuild = primaryBranch.createBuild({
      state: 'failed',
      number: '1917',
      repository
    });

    currentBuild.createCommit({
      sha: 'abc124'
    });

    repository.currentBuild = currentBuild;
    repository.save();

    primaryBranch.createBuild({
      state: 'errored',
      number: '1918',
      branch: primaryBranch,
      repository,
    }).createCommit({
      committer_name: this.currentUser.name,
      sha: 'abc125'
    });

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const twoYearsAgo = new Date();
    twoYearsAgo.setYear(twoYearsAgo.getFullYear() - 2);

    const lastBuild = primaryBranch.createBuild({
      state: 'passed',
      number: '1919',
      finished_at: oneYearAgo,
      branch: primaryBranch,
      repository,
    });

    lastBuild.createCommit({
      sha: '1234567890',
      committer: gitUser
    });
    lastBuild.save();

    const activeCreatedBranch = server.create('branch', {
      name: 'created',
      id: `/v3/repos/${repoId}/branches/created`,
      exists_on_github: true,
      default_branch: false,
      repository,
    });

    server.create('build', {
      state: 'created',
      branch: activeCreatedBranch,
      repository,
    });

    const activeFailedBranch = server.create('branch', {
      name: 'edits',
      id: `/v3/repos/${repoId}/branches/edits`,
      exists_on_github: true,
      default_branch: false,
      repository,
    });

    server.create('build', {
      state: 'failed',
      finished_at: oneYearAgo,
      branch: activeFailedBranch,
      repository,
    });

    const activeOlderFailedBranch = server.create('branch', {
      name: 'old-old-edits',
      id: `/v3/repos/${repoId}/branches/old-old-edits`,
      exists_on_github: true,
      default_branch: false,
      repository,
    });

    server.create('build', {
      state: 'failed',
      finished_at: twoYearsAgo,
      branch: activeOlderFailedBranch,
      repository,
    });

    const olderInactiveBranch = server.create('branch', {
      name: 'older-edits',
      id: `/v3/repos/${repoId}/branches/older-edits`,
      exists_on_github: false,
      default_branch: false,
      repository,
    });

    olderInactiveBranch.createBuild({
      finished_at: twoYearsAgo
    });

    const newerInactiveBranch = server.create('branch', {
      name: 'old-edits',
      id: `/v3/repos/${repoId}/branches/old-edits`,
      exists_on_github: false,
      default_branch: false,
      repository,
    });

    server.create('build', {
      state: 'errored',
      finished_at: oneYearAgo,
      branch: newerInactiveBranch,
      repository,
    }).createCommit({
      sha: 'abc134',
      committer: gitUser
    });
  }
});

test('view branches', function (assert) {
  branchesPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(document.title, 'killjoys/living-a-feminist-life - Travis CI');
    assert.ok(branchesPage.branchesTabActive, 'Branches tab is active when visiting /org/repo/branches');
  });

  andThen(() => {
    assert.equal(branchesPage.defaultBranch.name, 'primary');
    assert.ok(branchesPage.defaultBranch.passed, 'expected default branch last build to have passed');
    assert.equal(branchesPage.defaultBranch.buildCount, '3 builds');
    assert.equal(branchesPage.defaultBranch.request, '#1919 passed');
    assert.equal(branchesPage.defaultBranch.commitSha, '1234567');
    assert.equal(branchesPage.defaultBranch.committer, 'Sara Ahmed');
    assert.equal(branchesPage.defaultBranch.commitDate, 'about a year ago');

    const buildTiles = branchesPage.defaultBranch.buildTiles;

    assert.ok(buildTiles(0).passed, 'expected most recent build to have passed');
    assert.equal(buildTiles(0).number, '#1919');

    assert.ok(buildTiles(1).errored, 'expected second-most recent build to have errored');
    assert.equal(buildTiles(1).number, '#1918');

    assert.ok(buildTiles(2).failed, 'expected third-most recent build to have failed');
    assert.equal(buildTiles(2).number, '#1917');

    assert.ok(buildTiles(3).empty, 'expected fourth tile to be empty');

    assert.equal(branchesPage.activeBranches().count, 3, 'expected three active branches');

    assert.equal(branchesPage.activeBranches(0).name, 'created', 'expected created branch to be sorted first');
    assert.ok(branchesPage.activeBranches(0).created, 'expected created branch to be running');

    assert.equal(branchesPage.activeBranches(1).name, 'edits', 'expected newer completed branch to be sorted next');
    assert.ok(branchesPage.activeBranches(1).failed, 'expected edits branch to have failed');

    assert.equal(branchesPage.activeBranches(2).name, 'old-old-edits', 'expected older completed branch to be sorted last');

    assert.equal(branchesPage.inactiveBranches().count, 2, 'expected two inactive branches');
    assert.equal(branchesPage.inactiveBranches(0).name, 'old-edits');
    assert.ok(branchesPage.inactiveBranches(0).errored, 'expected first inactive branch to have errored');
    assert.equal(branchesPage.inactiveBranches(1).name, 'older-edits');
  });
  percySnapshot(assert);
});

test('view branches tab when no branches present', function (assert) {
  // destroy state from previous tests
  server.db.branches.remove();
  server.db.repositories.remove();
  server.db.builds.remove();

  server.create('repository');

  branchesPage.visit({ organization: 'travis-ci', repo: 'travis-web' });

  andThen(() => {
    assert.equal(branchesPage.showsNoBranchesMessaging, 'No other branches for this repository', 'Branches tab shows no branches message');
  });
});
