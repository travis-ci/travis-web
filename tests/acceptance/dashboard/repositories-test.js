import { skip, test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';
import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | dashboard/repositories', {
  beforeEach() {
    server.create('feature', { name: 'dashboard', description: 'hello', enabled: true });

    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
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
  }
});

test('visiting /dashboard/ with feature flag disabled', function (assert) {
  server.db.features.remove();
  visit('/dashboard/');

  andThen(() => {
    assert.notEqual(currentURL(), '/dashboard/');
  });
});

test('visiting /dashboard/ with feature flag enabled', function (assert) {
  visit('/');

  andThen(() => {
    assert.equal(currentRouteName(), 'dashboard.repositories');
    assert.equal(currentURL(), '/dashboard', 'we go to dashboard');
  });
});

test('starring and unstarring a repo', function (assert) {
  dashboardPage.visit();

  andThen(() => {
    assert.equal(dashboardPage.starredRepos.length, 1, 'there is one starred repo');
    assert.ok(dashboardPage.starredRepos[0].hasTofuButton, 'shows tofubutton if user has proper permissions');

    dashboardPage.activeRepos[3].clickStarButton();

    andThen(() => {
      assert.equal(dashboardPage.starredRepos.length, 2, 'there are two starred repos');

      dashboardPage.starredRepos[0].clickUnStarButton();

      andThen(() => {
        assert.equal(dashboardPage.starredRepos.length, 1, 'there are two starred repos');
      });
    });
  });
});

skip('filtering repos');

skip('triggering a build');

test('Dashboard pagination works', function (assert) {
  server.createList('repository', 12);

  dashboardPage.visit();

  andThen(() => {
    assert.equal(dashboardPage.starredRepos.length, 1, 'filters starred repos');
    assert.equal(dashboardPage.activeRepos.length, 10, 'lists all active repos');
    assert.ok(dashboardPage.paginationIsVisible, 'pagination component renders');
    assert.equal(dashboardPage.paginationLinks.length, 3, 'calcs and displays pagination links');
    assert.equal(dashboardPage.paginationLinks[2].label, 'next', 'also displays next link');

    percySnapshot(assert);

    dashboardPage.paginationLinks[1].page();

    andThen(() => {
      assert.equal(dashboardPage.starredRepos.length, 1, 'still lists starred repos on top');
      assert.equal(dashboardPage.activeRepos.length, 6, 'lists other repos on the 2nd page');
    });
  });
});

test('logging out leaves the dashboard', function (assert) {
  dashboardPage.visit();

  andThen(() => {});
  topPage.clickSigOutLink();

  andThen(() => {
    assert.equal(currentURL(), '/');
  });
});
