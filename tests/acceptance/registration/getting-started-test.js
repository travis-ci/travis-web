import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';
import dashboardPage from 'travis/tests/pages/dashboard';
import header from 'travis/tests/pages/header';

moduleForAcceptance('Acceptance | registration/getting started', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);
  }
});

test('signed in but without repositories', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/getting_started');
  });
});

test('added repository while onboarding persists to dashboard', function(assert) {
  const repo = server.create('repository');
  profilePage.visit({username: 'testuser'});

  andThen(() => {
    assert.equal(currentURL(), 'profile/testuser');
  });

  const inactiveHook = server.create('hook', {
    name: 'test-repo',
    owner_name: 'testuser',
    active: false,
    admin: true
  });

  profilePage.administerableHooks(0).toggle();

  andThen(() => {
    assert.ok(server.db.hooks[0].active, 'repo is enabled');
    header.clickDashboardLink();
  });

  andThen(() => {
    assert.notEqual(currentURL(), '/getting_started');
    assert.equal(dashboardPage.sidebarRepositories(0).name, "testuser/test-repo", "Newly enabled repository should display in sidebar");
  });
});

moduleForAcceptance('Acceptance | logged in user with repositories', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    signInUser(currentUser);

    const livingAFeministLife = server.create('repository', {
      slug: 'killjoys/living-a-feminist-life'
    });

    const willfulSubjects = server.create('repository', {
      slug: 'killjoys/willful-subjects'
    });

    server.create('repository', {
      slug: 'other/other',
      skipPermissions: true
    });
  }
});

test('the home page shows the repositories', (assert) => {
  dashboardPage.visit();

  andThen(() => {
    assert.equal(dashboardPage.sidebarRepositories().count, 2, 'expected two repositories in the sidebar');
    assert.equal(dashboardPage.sidebarRepositories(0).name, 'killjoys/willful-subjects');
    assert.equal(dashboardPage.sidebarRepositories(1).name, 'killjoys/living-a-feminist-life');
  });
});
