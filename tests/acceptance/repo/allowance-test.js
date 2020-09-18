import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import page from 'travis/tests/pages/repo/show';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | repo allowance', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    enableFeature('proVersion');
    const currentUser = this.server.create('user', {login: 'user-login'});
    signInUser(currentUser);

    this.server.create('user', {login: 'user-login2'});
    this.server.create('user', {login: 'user-login3'});

    const repoPrivate = this.server.create('repository', {
      name: 'repository-private',
      slug: 'user-login/repository-private',
      'private': true,
      active: true,
      owner: {
        login: 'user-login',
        id: 1
      },
      vcs_name: 'repository-private',
      owner_name: 'user-login'
    });

    this.server.create('allowance', {
      subscription_type: 2,
      public_repos: false,
      private_repos: false,
      concurrency_limit: 777
    }),

    this.server.create('allowance', {
      subscription_type: 2,
      public_repos: true,
      private_repos: true,
      concurrency_limit: 666
    }),

    this.server.create('allowance', {
      subscription_type: 2,
      public_repos: true,
      private_repos: false,
      concurrency_limit: 2
    }),

    this.server.create('repository', {
      name: 'repository-public',
      slug: 'user-login/repository-public',
      'private': false,
      active: true,
      owner: {
        login: 'user-login',
        id: 1
      },
      vcs_name: 'repository-public',
      owner_name: 'user-login'
    });

    this.server.create('repository', {
      name: 'repository-private-allowed',
      slug: 'user-login2/repository-private-allowed',
      'private': true,
      active: true,
      owner: {
        login: 'user-login2',
        id: 2
      },
      vcs_name: 'repository-private',
      owner_name: 'user-login2'
    });

    this.server.create('repository', {
      name: 'repository-public-allowed',
      slug: 'user-login3/repository-public-allowed',
      'private': false,
      active: true,
      owner: {
        login: 'user-login3',
        id: 3
      },
      vcs_name: 'repository-public',
      owner_name: 'user-login3'
    });

    let branch = repoPrivate.createBranch({
      name: 'feminist#yes',
      id: '/v3/repo/${repoPrivate.id}/branch/feminist#yes',
      default_branch: true
    });

    repoPrivate.createBranch({
      name: 'patriarchy#no',
      id: '/v3/repo/${repoPrivate.id}/branch/patriarchy#no',
      default_branch: false
    });

    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repoPrivate, state: 'passed', commit_id: commit.id, commit, branch, finished_at: new Date() });

    let firstJob = this.server.create('job', { number: '1234.1', repository: repoPrivate, state: 'passed', config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build });
    commit.job = firstJob;

    firstJob.save();
    commit.save();

    this.server.create('job', { number: '1234.2', repository: repoPrivate, state: 'passed', config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build });
    this.server.create('job', { allow_failure: true, number: '1234.999', repository: repoPrivate, state: 'failed', config: { language: 'ruby', os: 'jorts' }, commit, build });
  });

  test('warning is displayed in case owner cannot build in private repository', async function (assert) {
    await page.visit({ organization: 'user-login', repo: 'repository-private' });

    assert.equal(page.flash, 'Builds have been temporarily disabled for private repositories due to a negative credit balance. Please go to the Plan page to replenish your credit balance.');
  });

  test('warning is displayed in case owner cannot build in public repository', async function (assert) {
    await page.visit({ organization: 'user-login', repo: 'repository-public' });

    assert.equal(page.flash, 'Builds have been temporarily disabled for public repositories due to a negative credit balance. Please go to the Plan page to replenish your credit balance or alter your OSS Credits consumption setting.');
  });

  test('warning is not displayed in case owner can build in private repository', async function (assert) {
    await page.visit({ organization: 'user-login2', repo: 'repository-private-allowed' });

    assert.dom('[data-test-components-flash-item]').doesNotExist();
  });

  test('warning is not displayed in case owner can build in public repository', async function (assert) {
    await page.visit({ organization: 'user-login3', repo: 'repository-public-allowed' });

    assert.dom('[data-test-components-flash-item]').doesNotExist();
  });
});
