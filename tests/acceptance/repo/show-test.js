import { settled, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import page from 'travis/tests/pages/repo/show';
import buildPage from 'travis/tests/pages/build';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | show repo page', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user', {login: 'user-login'});
    this.server.create('allowance', {subscription_type: 1});

    this.server.create('organization', {login: 'org-login'});
    this.server.create('allowance', {subscription_type: 1});
    signInUser(currentUser);

    const repo = this.server.create('repository', {
      name: 'repository-name',
      slug: 'org-login/repository-name',
      owner: {
        login: 'org-login',
        id: 2
      },
      vcs_name: 'repository-name',
      owner_name: 'org-login'
    });

    let branch = repo.createBranch({
      name: 'feminist_yes',
      id: '/v3/repo/${repository.id}/branch/feminist_yes',
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

    let otherRepository = this.server.create('repository', {
      name: 'other-repository',
      vcs_name: 'other-repository',
      slug: 'org-login/other-repository',
      owner: {
        login: 'user-login'
      },
      owner_name: 'user-login'
    });

    this.otherBranch = otherRepository.createBranch({
      name: 'branchwhat',
      id: '/v3/repo/${repository.id}/branch/branchwhat',
      default_branch: true
    });

    let otherCommit = this.server.create('commit', {
      author: gitUser,
      committer: gitUser,
      branch: 'other-tests',
      message: 'An other message',
      branch_is_default: true
    });

    let otherBuild = this.server.create('build', {
      repository: otherRepository,
      state: 'failed',
      commit_id: commit.id,
      commit: otherCommit,
      branch: this.otherBranch,
      finished_at: new Date(1919, 4, 1),
    });

    let otherJob = this.server.create('job', {
      number: '1919.1919',
      repository: otherRepository,
      state: 'failed',
      config: {},
      commit: otherCommit,
      build: otherBuild
    });
    otherCommit.job = otherJob;
    otherJob.save();
    otherCommit.save();

    this.server.get(`/repo/2/branch/${this.otherBranch.name}`, () => this.otherBranch);

    this.server.get('/repo/1/branch/feminist_yes', () => branch);
  });

  test('loading branches doesnt update the default branch on the repo', async function (assert) {
    await page.visit({ organization: 'org-login', repo: 'repository-name' });
    await page.statusBadge.click();

    const url = new URL(page.statusBadge.src);
    const expectedPath = `${url.pathname}?${url.searchParams}`;
    assert.equal(expectedPath, '/org-login/repository-name.svg?branch=feminist_yes&status=passed');

    assert.equal(page.statusBadge.title, 'Latest push build on default branch: passed');
  });

  test('repository header is rendered', async function (assert) {
    await page.visit({ organization: 'org-login', repo: 'repository-name' });

    assert.equal(page.owner, 'org-login');
    assert.equal(page.name, 'repository-name');

    assert.equal(page.gitHubLink.href, 'https://github.com/org-login/repository-name');
    assert.equal(page.gitHubLink.title, 'repository-name on GitHub');
  });

  test('visiting the root shows the most recent current build', async function (assert) {
    await visit('/');
    await settled();

    assert.equal(buildPage.requiredJobs.length, 2, 'expected two required jobs in the matrix');
    assert.equal(buildPage.allowedFailureJobs.length, 1, 'expected one allowed failure job');
  });
});
