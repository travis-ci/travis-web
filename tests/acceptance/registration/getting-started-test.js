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
  let repoId = 1;

  server.create('permissions', {
    admin: [repoId],
    push: [repoId],
    pull: [repoId],
    permissions: [repoId],
  });

  dashboardPage
    .visit()
    .navigateToProfilePage();

  andThen(() => {
    assert.equal(currentURL(), '/profile/testuser');
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
