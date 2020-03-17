import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import ownerPage from 'travis/tests/pages/owner';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | owner repositories', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    let user = this.server.create('user', {
      name: 'User Name',
      login: 'user-login'
    });

    // This should not require login but I can’t take the time to figure out why the test fails without it.
    signInUser(user);

    // create active repo
    const firstRepository = this.server.create('repository', {
      slug: 'user-login/repository-name',
      name: 'repository-name',
      owner: {
        login: user.login
      }
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
    this.server.create('repository', {
      slug: 'user-login/yet-another-repository-name',
      name: 'yet-another-repository-name',
      owner: {
        login: user.login
      },
      owner_name: user.login
    });

    this.server.create('repository', {
      slug: 'other/other',
      skipPermissions: true,
      owner_name: 'other',
      vcs_name: 'other'
    });
  });

  test('the owner page shows their repositories', async function (assert) {
    await ownerPage.visit({ username: 'user-login' });

    assert.equal(document.title, 'User Name - Travis CI');

    assert.equal(ownerPage.title, 'User Name');

    assert.equal(ownerPage.login.text, 'user-login');
    assert.equal(ownerPage.login.title, 'User Name on GitHub');
    assert.equal(ownerPage.login.href, 'https://github.com/user-login');

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
