import { test } from 'qunit';
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

    server.create('repository', {
      owner: {
        login: 'travis-ci',
        type: 'organization'
      },
      name: 'travis-web',
      currentBuild: {
        branch: { name: 'some-branch' },
        eventType: 'cron',
        number: 2,
        state: 'failed',
        finishedAt: '2016-11-10T14:37:44Z'
      },
      defaultBranch: {
        name: 'master',
        lastBuild: {
          number: 1,
          eventType: 'api',
          state: 'passed',
        }
      }
    });
    server.create('repository', {
      owner: {
        login: 'travis-repos',
        type: 'organization'
      },
      name: 'repo-python',
      currentBuild: {
        branch: { name: 'some-branch' },
        eventType: 'cron',
        number: 2,
        state: 'failed',
        finishedAt: '2016-11-09T14:37:44Z'
      },
    });
    server.create('repository', {
      owner: {
        login: 'travis-repos',
        type: 'organization'
      },
      name: 'repo-clojure',
      currentBuild: {
        branch: { name: 'some-branch' },
        eventType: 'cron',
        number: 2,
        state: 'failed',
        finishedAt: '2016-11-8T14:37:44Z'
      },
    });
    server.create('repository', {
      owner: {
        login: 'travis-ci',
        type: 'organization'
      },
      name: 'travis-lol',
      starred: true,
      currentBuild: {
        branch: { name: 'some-branch' },
        eventType: 'cron',
        number: 2,
        state: 'failed',
        finishedAt: '2016-11-07T14:37:44Z'
      },
      defaultBranch: {
        name: 'default',
        lastBuild: {
          number: 1,
          eventType: 'cron',
          state: 'passed',
        }
      }
    });
  }
});

test('visiting /dashboard/ with feature flag disabled', function (assert) {
  visit('/dashboard/');

  andThen(() => {
    assert.notEqual(currentURL(), '/dashboard/');
  });
});


test('visiting /dashboard/ with feature flag enabled', function (assert) {
  withFeature('dashboard');
  visit('/dashboard/');

  andThen(() => {
    assert.equal(currentURL(), '/dashboard/');
    assert.equal(dashboardPage.activeRepos().count, 4, 'lists all repos of the user');
    assert.equal(dashboardPage.activeRepos(0).owner, 'travis-ci', 'displays owner of repo');
    assert.equal(dashboardPage.activeRepos(0).repoName, 'travis-web', 'displays name of repo');
    // assert.equal(dashboardPage.activeRepos(0).defaultBranch, 'default passed', 'displays name and status of default branch');
    // assert.equal(dashboardPage.activeRepos(0).lastBuild, '#2 failed', 'displays number and status of last build');

    assert.equal(dashboardPage.starredRepos().count, 1, 'lists starred repos in correct section');
  });
});

/*
test('filtering repos', function (assert) {
  withFeature('dashboard');
  visit('/dashboard/');
  click(dashboardPage.accountFilter);

  andThen(() => {
    assert.equal(dashboardPage.activeRepos().count, 2, 'filters repos for accounts');
  });
});
*/

/*
test('triggering a build', function (assert) {

});
*/
