import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import ownerPage from 'travis/tests/pages/owner';

moduleForAcceptance('Acceptance | owner repositories', {
  beforeEach() {
    server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    // create active repo
    const firstRepository = server.create('repository', {
      slug: 'user-login/repository-name'
    });

    const primaryBranch = firstRepository.createBranch({
      name: 'primary',
      id: `/v3/repo/${firstRepository.id}/branch/primary`,
      default_branch: true
    });

    firstRepository.save();

    const oneYearAgo = new Date();
    oneYearAgo.setYear(oneYearAgo.getFullYear() - 1);

    const lastBuild = primaryBranch.createBuild({
      state: 'failed',
      number: '1917',
      finished_at: oneYearAgo
    });

    lastBuild.createCommit({
      sha: 'abc124'
    });

    lastBuild.save();

    // create active repo
    server.create('repository', {
      slug: 'user-login/yet-another-repository-name'
    });

    server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });
  }
});

test('the owner page shows their repositories', (assert) => {
  ownerPage.visit({ username: 'user-login' });

  andThen(() => {
    assert.equal(document.title, 'User Name - Travis CI');

    assert.equal(ownerPage.repos.length, 2);

    ownerPage.repos[0].as(repo => {
      assert.equal(repo.name, 'repository-name');

      assert.equal(repo.buildNumber, '1917');
      assert.equal(repo.defaultBranch, 'primary');
      assert.equal(repo.commitSha, 'abc124');
      assert.equal(repo.commitDate, 'about a year ago');
    });

    ownerPage.repos[1].as(repo => {
      assert.equal(repo.name, 'yet-another-repository-name');
      assert.equal(repo.noBuildMessage, 'There is no build on the default branch yet.');
    });
  });
});
