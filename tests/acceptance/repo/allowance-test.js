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

    const repo = this.server.create('repository', {
      name: 'repository-name',
      slug: 'user-login/repository-name',
      'private': false,
      active: true,
      owner: {
        login: 'user-login',
        allowance: {
          subscription_type: 2,
          private_repos: false,
          public_repos: false,
          concurrency_limit: 1
        }
      },
      vcs_name: 'repository-name',
      owner_name: 'user-login'
    });

    let branch = repo.createBranch({
      name: 'feminist#yes',
      id: '/v3/repo/${repository.id}/branch/feminist#yes',
      default_branch: true
    });

    repo.createBranch({
      name: 'patriarchy#no',
      id: '/v3/repo/${repository.id}/branch/patriarchy#no',
      default_branch: false
    });

    let gitUser = this.server.create('git-user', { name: 'Mr T' });
    let commit = this.server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = this.server.create('build', { repository: repo, state: 'passed', commit_id: commit.id, commit, branch, finished_at: new Date() });

    let firstJob = this.server.create('job', { number: '1234.1', repository: repo, state: 'passed', config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build });
    commit.job = firstJob;

    firstJob.save();
    commit.save();

    this.server.create('job', { number: '1234.2', repository: repo, state: 'passed', config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build });
    this.server.create('job', { allow_failure: true, number: '1234.999', repository: repo, state: 'failed', config: { language: 'ruby', os: 'jorts' }, commit, build });
  });

  test('warning is displayed in case owner cannot build', async function (assert) {
    await page.visit({ organization: 'user-login', repo: 'repository-name' });

    assert.equal(page.flash, 'Builds have been temporarily disabled for this repository due to a negative credit balance. Please go to the Plan page to replenish your credit balance or alter your OSS Credits consumption setting');
  });
});
