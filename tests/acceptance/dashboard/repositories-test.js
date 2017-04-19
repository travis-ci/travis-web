import { skip, test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import dashboardPage from 'travis/tests/pages/dashboard';

moduleForAcceptance('Acceptance | dashboard/repositories', {
  beforeEach() {
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
    server.create('repository', {
      owner: {
        login: 'travis-ci',
        type: 'organization'
      },
      name: 'travis-web',
      currentBuild: build,
      defaultBranch: branch
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
      currentBuild: build,
      defaultBranch: branch
    });
  }
});

test('visiting /dashboard/ with feature flag disabled', function (assert) {
  visit('/dashboard/');

  andThen(() => {
    assert.notEqual(currentURL(), '/dashboard/');
  });
});

skip('visiting /dashboard/ with feature flag enabled', function (assert) {
  withFeature('dashboard');
  visit('/');

  andThen(() => {
    assert.equal(currentRouteName(), 'dashboard.repositories');
    assert.equal(currentURL(), '/dashboard', 'we go to dashboard');
    assert.equal(dashboardPage.activeRepos().count, 4, 'lists all repos of the user');
    assert.equal(dashboardPage.activeRepos(0).owner, 'travis-ci', 'displays owner of repo');
    assert.equal(dashboardPage.activeRepos(0).repoName, 'travis-web', 'displays name of repo');
    // assert.equal(dashboardPage.activeRepos(0).defaultBranch, 'default passed', 'displays name and status of default branch');
    // assert.equal(dashboardPage.activeRepos(0).lastBuild, '#2 failed', 'displays number and status of last build');
    assert.equal(dashboardPage.starredRepos().count, 1, 'lists starred repos in correct section');

    percySnapshot(assert);
  });
});

skip('filtering repos', function (assert) {
  withFeature('dashboard');
  visit('/dashboard/');
  click(dashboardPage.accountFilter);

  andThen(() => {
    assert.equal(dashboardPage.activeRepos().count, 2, 'filters repos for accounts');
  });
});

skip('triggering a build', function () {

});
