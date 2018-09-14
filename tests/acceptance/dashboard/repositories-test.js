import { currentURL, currentRouteName, visit, click } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import page from 'travis/tests/pages/dashboard';
import topPage from 'travis/tests/pages/top';
import generatePusherPayload from 'travis/tests/helpers/generate-pusher-payload';

module('Acceptance | dashboard/repositories', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });
    this.currentUser = currentUser;

    signInUser(currentUser);

    let build = server.create('build', {
      branch: server.create('branch', { name: 'some-branch' }),
      eventType: 'cron',
      number: 2,
      state: 'failed',
      finishedAt: '2016-11-10T14:37:44Z'
    });
    let branch = server.create('branch', {
      name: 'master',
      lastBuild: server.create('build', {
        number: 1,
        eventType: 'api',
        state: 'passed',
      })
    });
    this.branch = branch;

    let oneYearAgo = new Date(new Date() - 1000 * 60 * 60 * 24 * 365);
    let beforeOneYearAgo = new Date(oneYearAgo.getTime() - 1000 * 60 * 19 - 1000 * 19);

    let permissionBuild = server.create('build', {
      id: 1919,
      branch: server.create('branch', { name: 'another-branch' }),
      eventType: 'push',
      number: 44,
      state: 'passed',
      started_at: beforeOneYearAgo,
      finished_at: oneYearAgo,
      commit: server.create('commit', {
        message: 'get used to it',
        sha: 'acab'
      })
    });
    let permissionBranch = server.create('branch', {
      name: 'primary',
      lastBuild: server.create('build', {
        number: 55,
        eventType: 'push',
        state: 'passed'
      })
    });
    this.repository = server.create('repository', {
      owner: {
        login: 'travis-ci',
        type: 'organization'
      },
      name: 'travis-web',
      currentBuild: build,
      defaultBranch: branch,
    });
    server.create('repository', {
      owner: {
        login: 'travis-repos',
        type: 'organization'
      },
      name: 'repo-python',
      currentBuild: build,
    });
    server.create('repository', {
      owner: {
        login: 'travis-repos',
        type: 'organization'
      },
      name: 'repo-clojure',
      currentBuild: build,
      private: true
    });
    server.create('repository', {
      owner: {
        login: 'travis-ci',
        type: 'organization'
      },
      name: 'travis-lol-a-very-long-repository',
      starred: true,
      currentBuild: permissionBuild,
      defaultBranch: permissionBranch,
      permissions: {
        create_request: true
      }
    });
  });

  test('visiting /dashboard/ with feature flag disabled', async function (assert) {
    await visit('/dashboard/');

    assert.notEqual(currentURL(), '/dashboard/');
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

    assert.dom('[data-test-dashboard-starred-repositories] [data-test-dashboard-repository-star]').exists({ count: 1 });
    assert.dom('[data-test-dashboard-repository-menu="0"] [data-test-tofu-menu]').exists();


    await click('[data-test-dashboard-repository-star="3"]');
    assert.dom('[data-test-dashboard-starred-repositories] [data-test-dashboard-repository-star]').exists({ count: 2 });

    await click('[data-test-dashboard-repository-star="3"]');
    assert.dom('[data-test-dashboard-starred-repositories] [data-test-dashboard-repository-star]').exists({ count: 1 });
  });

  test('Dashboard pagination works', async function (assert) {
    enableFeature('dashboard');

    server.createList('repository', 12);

    await visit('/dashboard');

    assert.dom('[data-test-dashboard-starred-repositories] [data-test-dashboard-repository-star]').exists({ count: 1 });
    assert.dom('[data-test-dashboard-active-repositories] [data-test-dashboard-repository-star]').exists({ count: 10 });
    assert.dom('[data-test-components-pagination-navigation]').exists();
    assert.dom('[data-test-page-pagination-link]').exists({ count: 2 });
    assert.dom('[data-test-next-pagination-link]').exists();

    percySnapshot(assert);

    await click('[data-test-page-pagination-link="2"]');

    assert.dom('[data-test-dashboard-starred-repositories] [data-test-dashboard-repository-star]').exists({ count: 1 }, 'still lists starred repos on top');
    assert.dom('[data-test-dashboard-active-repositories] [data-test-dashboard-repository-star]').exists({ count: 6 }, 'lists other repos on the 2nd page');
  });

  test('listing my builds', async function (assert) {
    enableFeature('dashboard');

    await page.visit();
    await page.myBuilds.visit();

    percySnapshot(assert);

    assert.equal(currentURL(), '/dashboard/builds');
    assert.equal(page.myBuilds.builds.length, 4);

    page.myBuilds.builds[2].as(build => {
      assert.ok(build.isPublic);

      assert.ok(build.isPassed);

      assert.equal(build.owner.text, 'travis-ci');
      assert.ok(build.owner.href.endsWith('/travis-ci'));

      assert.equal(build.repo.text, 'travis-lol-a-very-long-repository');
      assert.ok(build.repo.href.endsWith('/travis-ci/travis-lol-a-very-long-repository'));

      assert.equal(build.branch.text, 'another-branch');
      assert.ok(build.branch.href.endsWith('travis-ci/travis-lol-a-very-long-repository/tree/another-branch'));

      assert.equal(build.message, 'get used to it');

      assert.equal(build.stateAndNumber.text, '#44 passed');
      assert.ok(build.stateAndNumber.href.endsWith('/travis-ci/travis-lol-a-very-long-repository/builds/1919'));

      assert.equal(build.sha.text, 'acab');
      assert.ok(build.sha.href.endsWith('/travis-ci/travis-lol-a-very-long-repository/commit/acab'));

      assert.equal(build.duration, '19 min 19 sec');
      assert.equal(build.finished, 'about a year ago');
    });

    page.myBuilds.builds[1].as(build => {
      assert.equal(build.finished, 'still running');
    });

    page.myBuilds.builds[0].as(build => {
      assert.ok(build.isFailed);
      assert.ok(build.isPrivate);
    });

    assert.equal(page.starredRepos.length, 1);

    await page.myBuilds.builds[2].restart();

    assert.equal(topPage.flashMessage.text, 'The build was successfully restarted.');

    const commit = server.create('commit', {
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
      state: 'passed',
      finished_at: '2017-03-27T12:00:00Z',
      createdBy: this.currentUser
    });

    let job = build.createJob({
      id: 100,
      repository: this.repository,
      build,
      commit,
      number: '15.1',
      state: 'passed',
      finished_at: '2017-03-27T12:00:00Z'
    });

    await this.owner.application.pusher.receive('build:created', {
      build: generatePusherPayload(build),
      commit: generatePusherPayload(commit),
      repository: generatePusherPayload(this.repository, { current_build_id: build.id })
    });

    assert.equal(page.myBuilds.builds.length, 5);

    let otherRepository = server.create('repository');

    let otherBuild = server.create('build', {
      createdBy: server.create('user'),
      repository: otherRepository
    });

    let otherCommit = server.create('commit');

    await this.owner.application.pusher.receive('build:created', {
      build: generatePusherPayload(otherBuild),
      commit: generatePusherPayload(otherCommit),
      repository: generatePusherPayload(otherRepository)
    });

    assert.equal(page.myBuilds.builds.length, 5);

    await page.activeRepos.visit();

    assert.equal(page.activeRepos.repos.length, 4);
  });

  test('logging out leaves the dashboard', async function (assert) {
    enableFeature('dashboard');

    await visit('/dashboard');

    await click('[data-test-signout-link]');

    assert.equal(currentURL(), '/');
  });
});
