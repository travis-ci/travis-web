import { currentURL, currentRouteName, visit, click } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';
import { percySnapshot } from 'ember-percy';
import page from 'travis/tests/pages/dashboard';

module('Acceptance | dashboard/repositories', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user', {
      name: 'User Name',
      login: 'user-login',
    });

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
    let permissionBuild = server.create('build', {
      branch: server.create('branch', { name: 'another-branch' }),
      eventType: 'push',
      number: 44,
      state: 'passed',
      finishedAt: '2017-09-19T12:14:00Z'
    });
    let permissionBranch = server.create('branch', {
      name: 'primary',
      lastBuild: server.create('build', {
        number: 55,
        eventType: 'push',
        state: 'passed'
      })
    });
    server.create('repository', {
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
    });
    server.create('repository', {
      owner: {
        login: 'travis-ci',
        type: 'organization'
      },
      name: 'travis-lol',
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


    await click('[data-test-dashboard-repository-star="2"]');
    assert.dom('[data-test-dashboard-starred-repositories] [data-test-dashboard-repository-star]').exists({ count: 2 });

    await click('[data-test-dashboard-repository-star="2"]');
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

    assert.equal(currentURL(), '/dashboard/my-builds');
    assert.equal(page.myBuilds.builds.length, 4);

    assert.equal(page.starredRepos.length, 1);

    await page.activeRepos.visit();

    assert.equal(page.activeRepos.repos.length, 3);
  });

  test('logging out leaves the dashboard', async function (assert) {
    enableFeature('dashboard');

    await visit('/dashboard');

    await click('[data-test-signout-link]');

    assert.equal(currentURL(), '/');
  });
});
