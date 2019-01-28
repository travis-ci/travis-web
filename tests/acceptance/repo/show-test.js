import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import page from 'travis/tests/pages/repo/show';
import buildPage from 'travis/tests/pages/build';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | show repo page', {
  beforeEach() {
    const currentUser = server.create('user', {login: 'user-login'});
    signInUser(currentUser);

    const repo = server.create('repository', {
      name: 'repository-name',
      slug: 'org-login/repository-name',
      owner: {
        login: 'org-login'
      },
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

    let gitUser = server.create('git-user', { name: 'Mr T' });
    let commit = server.create('commit', { author: gitUser, committer: gitUser, branch: 'acceptance-tests', message: 'This is a message', branch_is_default: true });
    let build = server.create('build', { repository: repo, state: 'passed', commit_id: commit.id, commit, branch, finished_at: new Date() });

    let firstJob = server.create('job', { number: '1234.1', repository: repo, state: 'passed', config: { env: 'JORTS', os: 'linux', language: 'node_js', node_js: 5 }, commit, build });
    commit.job = firstJob;

    firstJob.save();
    commit.save();

    server.create('job', { number: '1234.2', repository: repo, state: 'passed', config: { env: 'JANTS', os: 'osx', language: 'ruby', rvm: 2.2 }, commit, build });
    server.create('job', { allow_failure: true, number: '1234.999', repository: repo, state: 'failed', config: { language: 'ruby', os: 'jorts' }, commit, build });

    let otherRepository = server.create('repository', {
      name: 'other-repository',
      slug: 'org-login/other-repository',
      owner: {
        login: 'user-login'
      },
    });

    let otherBranch = otherRepository.createBranch({
      name: 'branch#what',
      id: '/v3/repo/${repository.id}/branch/branch#what',
      default_branch: true
    });

    let otherCommit = server.create('commit', {
      author: gitUser,
      committer: gitUser,
      branch: 'other-tests',
      message: 'An other message',
      branch_is_default: true
    });

    let otherBuild = server.create('build', {
      repository: otherRepository,
      state: 'failed',
      commit_id: commit.id,
      commit: otherCommit,
      branch: otherBranch,
      finished_at: new Date(1919, 4, 1),
    });

    let otherJob = server.create('job', {
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
  }
});

test('loading branches doesnt update the default branch on the repo', function (assert) {
  page.visit({ organization: 'org-login', repo: 'repository-name' });
  page.openStatusImagePopup();

  andThen(() => {
    const url = new URL(page.statusBadgeImageSrc);
    const expectedPath = `${url.pathname}?${url.searchParams}`;
    assert.equal(expectedPath, '/org-login/repository-name.svg?branch=feminist%23yes');
  });
});

test('repository header is rendered', function (assert) {
  page.visit({ organization: 'org-login', repo: 'repository-name' });

  andThen(() => {
    assert.equal(page.owner, 'org-login');
    assert.equal(page.name, 'repository-name');

    assert.equal(page.gitHubLink.href, 'https://github.com/org-login/repository-name');
    assert.equal(page.gitHubLink.title, 'repository-name on GitHub');
  });
});

test('visiting the root shows the most recent current build', function (assert) {
  visit('/');

  andThen(() => {
    assert.equal(buildPage.requiredJobs.length, 2, 'expected two required jobs in the matrix');
    assert.equal(buildPage.allowedFailureJobs.length, 1, 'expected one allowed failure job');
  });
});
