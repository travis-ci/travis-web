import {
  click,
  currentRouteName,
  currentURL,
  settled,
  visit,
  waitFor
} from '@ember/test-helpers';
import { module, test, skip } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { prettyDate } from 'travis/helpers/pretty-date';
import page from 'travis/tests/pages/dashboard';
import topPage from 'travis/tests/pages/top';
import generatePusherPayload from 'travis/tests/helpers/generate-pusher-payload';
import { setupMirage } from 'ember-cli-mirage/test-support';
module('Acceptance | dashboard/repositories', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    enableFeature('proVersion');
    const currentUser = this.server.create('user', {
      name: 'User Name',
      login: 'user-login',
      confirmed_at: Date.now()
    });
    this.currentUser = currentUser;

    signInUser(currentUser);

    let build = this.server.create('build', {
      branch: this.server.create('branch', { name: 'some-branch' }),
      event_type: 'push',
      number: 2,
      state: 'failed',
      started_at: '2016-11-10T14:32:44Z',
      finishedAt: '2016-11-10T14:37:44Z',
      createdBy: currentUser
    });

    this.server.create('build', {
      branch: this.server.create('branch', { name: 'cron-branch' }),
      event_type: 'cron',
      number: 1,
      state: 'failed',
      started_at: '2015-11-10T14:32:44Z',
      finishedAt: '2015-11-10T14:37:44Z',
      createdBy: currentUser
    });

    let branch = this.server.create('branch', {
      name: 'master',
      lastBuild: this.server.create('build', {
        number: 1,
        event_type: 'api',
        state: 'passed',
        createdBy: currentUser
      })
    });
    this.branch = branch;

    let oneYearAgo = new Date(new Date() - 1000 * 60 * 60 * 24 * 365);
    let beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000 * 60 * 19 - 1000 * 19);

    let permissionBuild = this.server.create('build', {
      id: 1919,
      branch: this.server.create('branch', { name: 'another-branch' }),
      event_type: 'push',
      number: 44,
      state: 'passed',
      started_at: beforeOneYearAgo,
      finished_at: oneYearAgo,
      commit: this.server.create('commit', {
        message: 'get used to it',
        sha: 'acab'
      }),
      createdBy: currentUser
    });
    this.permissionBuild = permissionBuild;

    let permissionBranch = this.server.create('branch', {
      name: 'primary',
      lastBuild: this.server.create('build', {
        number: 55,
        event_type: 'push',
        state: 'passed',
        createdBy: currentUser
      })
    });

    this.repository = this.server.create('repository', {
      owner: {
        login: 'travis-ci',
        type: 'organization'
      },
      name: 'travis-web',
      vcs_name: 'travis-web',
      owner_name: 'travis-ci',
      currentBuild: build,
      defaultBranch: branch,
    });
    this.server.create('repository', {
      owner: {
        login: 'travis-repos',
        type: 'organization'
      },
      name: 'repo-python',
      vcs_name: 'repo-python',
      currentBuild: build,
      owner_name: 'travis-repos',
    });
    this.server.create('repository', {
      owner: {
        login: 'travis-repos',
        type: 'organization'
      },
      name: 'repo-clojure',
      vcs_name: 'repo-clojure',
      currentBuild: build,
      owner_name: 'travis-repos',
      private: true
    });
    this.starredRepo = this.server.create('repository', {
      owner: {
        login: 'travis-ci',
        type: 'organization'
      },
      name: 'travis-lol-a-very-long-repository',
      vcs_name: 'travis-lol-a-very-long-repository',
      owner_name: 'travis-ci',
      starred: true,
      currentBuild: permissionBuild,
      defaultBranch: permissionBranch,
      permissions: {
        create_request: true,
        build_create: true,
        build_restart: true
      }
    });

    this.server.get(`/repo/${this.repository.id}/branch/master`, () => {
      return this.branch;
    });
  });

  test('visiting /dashboard/ with feature flag disabled', async function (assert) {
    await visit('/dashboard/');

    assert.equal(currentURL(), '/dashboard/');
  });

  test('visiting /dashboard/ with feature flag enabled', async function (assert) {
    enableFeature('dashboard');

    await visit('/');

    assert.equal(currentRouteName(), 'dashboard.repositories');
    assert.equal(currentURL(), '/dashboard', 'we go to dashboard');
  });

  test('starring and unstarring a repo', async function (assert) {
    enableFeature('dashboard');

    await visit('/dashboard');

    assert.equal(page.starredRepos.length, 1);

    assert.ok(page.starredRepos[0].menuButton.isVisible);
    assert.equal(page.starredRepos[0].starButton.title, 'unstar this repo');

    assert.equal(page.activeRepos.repos[2].starButton.title, 'star this repo');

    await page.activeRepos.repos[2].starButton.click();
    assert.equal(page.starredRepos.length, 2);

    await page.starredRepos[1].starButton.click();
    assert.equal(page.starredRepos.length, 1);
  });

  test('triggering a build', async function (assert) {
    let requestCreated = false;

    this.server.post(`/repo/${this.starredRepo.id}/requests`, () => {
      requestCreated = true;
      return true;
    });

    await visit('/dashboard');

    await page.starredRepos[0].menuButton.click();
    await page.starredRepos[0].triggerBuild();

    assert.ok(requestCreated);
  });

  test('Dashboard pagination works', async function (assert) {
    enableFeature('dashboard');

    this.server.createList('repository', 12);

    await visit('/dashboard');

    assert.equal(page.starredRepos.length, 1);
    assert.equal(page.activeRepos.repos.length, 10);
    assert.dom('[data-test-components-pagination-navigation]').exists();
    assert.dom('[data-test-page-pagination-link]').exists({ count: 2 });
    assert.dom('[data-test-next-pagination-link]').exists();


    await click('[data-test-page-pagination-link="2"]');

    assert.equal(page.starredRepos.length, 1, 'still lists starred repos on top');
    assert.equal(page.activeRepos.repos.length, 6, 'lists other repos on the 2nd page');
  });

  test('listing my builds', async function (assert) {
    enableFeature('dashboard');

    await page.visit();
    await page.myBuilds.visit();

    assert.equal(currentURL(), '/dashboard/builds');
    assert.equal(page.myBuilds.builds.length, 4);

    page.myBuilds.builds[0].as(build => {
      assert.ok(build.isPublic);

      assert.ok(build.isPassed);

      assert.equal(build.owner.text, 'travis-ci');

      assert.ok(build.owner.href.endsWith('/travis-ci'));

      assert.equal(build.repo.text, 'travis-lol-a-very-long-repository');
      skip(build.repo.href.endsWith('/travis-ci/travis-lol-a-very-long-repository?serverType=git'));

      assert.equal(build.branch.text, 'another-branch');
      assert.ok(build.branch.href.endsWith('travis-ci/travis-lol-a-very-long-repository/tree/another-branch'));

      assert.equal(build.message.text, 'get used to it');
      assert.equal(build.message.title, 'get used to it');

      assert.equal(build.stateAndNumber.text, '#44 passed');
      assert.ok(build.stateAndNumber.href.endsWith('/travis-ci/travis-lol-a-very-long-repository/builds/1919'));

      assert.equal(build.sha.text, 'acab');
      assert.ok(build.sha.href.endsWith('/travis-ci/travis-lol-a-very-long-repository/commit/acab'));

      assert.equal(build.duration.text, '19 min 19 sec');
      assert.equal(build.duration.title, `Started ${prettyDate([this.permissionBuild.started_at])}`);

      assert.equal(build.finished.text, 'about a year ago');
      assert.equal(build.finished.title, this.permissionBuild.finished_at.toISOString());
    });

    page.myBuilds.builds[3].as(build => {
      assert.equal(build.finished.text, 'still running');
    });

    page.myBuilds.builds[1].as(build => {
      assert.ok(build.isFailed);
      assert.ok(build.isPrivate);
    });

    assert.equal(page.starredRepos.length, 1);

    await page.myBuilds.builds[0].restart();

    assert.equal(topPage.flashMessage.text, 'The build was successfully restarted.');

    const commit = this.server.create('commit', {
      id: 100,
      sha: 'acab',
      branch: 'primary',
      message: 'Add new chapter',
      committed_at: '2016-12-02T22:02:34Z',
    });

    let build = this.branch.createBuild({
      id: 100,
      number: 15,
      repository: this.repository,
      pull_request: false,
      event_type: 'push',
      state: 'created',
      started_at: new Date(),
      createdBy: this.currentUser
    });

    let job = build.createJob({
      id: 100,
      repository: this.repository,
      build,
      commit,
      number: '15.1',
      state: 'created',
    });

    await this.owner.application.pusher.receive('job:created', generatePusherPayload(job));
    await this.owner.application.pusher.receive('build:created', {
      build: generatePusherPayload(build),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository, { current_build_id: build.id })
    });

    await waitFor('.my-build:nth-child(1)');

    page.myBuilds.builds[0].as(build => {
      assert.equal(build.stateAndNumber.text, '#15 received');
    });


    let otherUser = this.server.create('user');
    let otherBranch = this.server.create('branch', {
      lastBuild: this.server.create('build', {
        createdBy: otherUser
      })
    });
    let otherRepository = this.server.create('repository', {
      defaultBranch: otherBranch
    });

    let otherBuild = otherBranch.createBuild({
      started_at: new Date(),
      createdBy: otherUser,
      repository: otherRepository
    });

    let otherCommit = this.server.create('commit');

    let otherJob = otherBuild.createJob({
      id: otherBuild.id,
      repository: otherRepository,
      build: otherBuild,
      commit: otherCommit,
      number: '1999.1',
      state: 'passed'
    });

    await this.owner.application.pusher.receive('job:created', generatePusherPayload(otherJob));
    await this.owner.application.pusher.receive('build:created', {
      build: generatePusherPayload(otherBuild),
      commit: generatePusherPayload(otherCommit),
      repository: generatePusherPayload(otherRepository, { current_build_id: otherBuild.id })
    });

    await waitFor('.my-build:nth-child(5)');

    assert.equal(page.myBuilds.builds.length, 5, 'expected the user’s new build to show but not the other user’s');

    await page.activeRepos.visit();

    assert.equal(page.activeRepos.repos.length, 4);
  });

  test('logging out leaves the dashboard', async function (assert) {
    enableFeature('dashboard');

    await visit('/dashboard');
    await settled();
    await click('[data-test-signout-link]');
    await settled();

    assert.equal(currentURL(), '/signin');
  });
});
