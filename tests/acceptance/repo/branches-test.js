import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import branchesPage from 'travis/tests/pages/branches';

moduleForAcceptance('Acceptance | repo branches', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

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
      default_branch: true
    });

    primaryBranch.createBuild({
      state: 'failed',
      number: '1917'
    }).createCommit({
      sha: 'abc124'
    });

    primaryBranch.createBuild({
      state: 'errored',
      number: '1918'
    }).createCommit({
      sha: 'abc125'
    });

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const lastBuild = primaryBranch.createBuild({
      state: 'passed',
      number: '1919',
      finished_at: oneYearAgo
    });

    lastBuild.createCommit({
      sha: '1234567890',
      committer: currentUser
    });
    lastBuild.save();

    const activeBranch = server.create('branch', {
      name: 'edits',
      id: `/v3/repos/${repoId}/branches/edits`,
      exists_on_github: true
    });

    activeBranch.createBuild({
      state: 'failed'
    });

    server.create('branch', {
      name: 'older-edits',
      id: `/v3/repos/${repoId}/branches/older-edits`,
      exists_on_github: false
    });

    const newerInactiveBranch = server.create('branch', {
      name: 'old-edits',
      id: `/v3/repos/${repoId}/branches/old-edits`,
      exists_on_github: false
    });

    newerInactiveBranch.createBuild({
      state: 'errored'
    }).createCommit({
      sha: 'abc134',
      committer: currentUser
    });
  }
});

test('view branches', function (assert) {
  branchesPage.visit({ organization: 'killjoys', repo: 'living-a-feminist-life' });

  andThen(() => {
    assert.equal(document.title, 'killjoys/living-a-feminist-life - Travis CI');
    assert.ok(branchesPage.branchesTabActive, 'Branches tab is active when visiting /org/repo/branches');

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

    assert.equal(branchesPage.activeBranches().count, 1, 'expected one active branch');
    assert.equal(branchesPage.activeBranches(0).name, 'edits');
    assert.ok(branchesPage.activeBranches(0).failed, 'expected active branch to have failed');

    assert.equal(branchesPage.inactiveBranches().count, 2, 'expected two inactive branches');
    assert.equal(branchesPage.inactiveBranches(0).name, 'old-edits');
    assert.ok(branchesPage.inactiveBranches(0).errored, 'expected first inactive branch to have errored');
    assert.equal(branchesPage.inactiveBranches(1).name, 'older-edits');
  });
});
