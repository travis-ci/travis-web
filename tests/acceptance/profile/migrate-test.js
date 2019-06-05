import { module, test } from 'qunit';
import { currentRouteName, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { enableFeature } from 'ember-feature-flags/test-support';
import profilePage from 'travis/tests/pages/profile';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | Profile | Migrate', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.user = server.create('user', {
      allowMigration: true,
      login: 'user-login',
      github_id: 1974,
    });

    server.create('installation', {
      owner: this.user,
      github_id: 2691
    });
    this.user.save();

    signInUser(this.user);
  });

  module('with GitHub Apps enabled', function (hooks) {

    hooks.beforeEach(function () {
      enableFeature('pro-version');
      enableFeature('github-apps');
    });

    module('tab without repositories to migrate', function (hooks) {

      hooks.beforeEach(async function () {
        await profilePage.visit();
        await profilePage.migrate.visit();
      });

      test('is visitable', function (assert) {
        assert.equal(currentRouteName(), 'account.migrate');
      });

      test('renders properly', function (assert) {
        const { title, commonIntro, step1Intro, activateButton, manualNote } = profilePage.migrate.page;
        assert.ok(title.isPresent);
        assert.ok(commonIntro.isPresent);
        assert.ok(step1Intro.isPresent);
        assert.ok(activateButton.isPresent);
        assert.ok(manualNote.isPresent);
      });

    });

    module('tab with repositories to migrate', function (hooks) {

      hooks.beforeEach(async function () {
        generateRepositoriesForMigration(server, this.user);
        await profilePage.visit();
        await profilePage.migrate.visit();
        await settled();
      });

      test('is visitable', function (assert) {
        assert.equal(currentRouteName(), 'account.migrate');
      });

      test('renders properly', function (assert) {
        const {
          title, commonIntro, step2Intro, activateLink, repoFilter, repoList, selectAll, migrateButton
        } = profilePage.migrate.page;
        assert.ok(title.isPresent);
        assert.ok(commonIntro.isPresent);
        assert.ok(step2Intro.isPresent);
        assert.ok(activateLink.isPresent);
        assert.ok(repoFilter.isPresent);
        assert.ok(repoList.isPresent);
        assert.ok(selectAll.isPresent);
        assert.ok(migrateButton.isPresent);
      });

    });

  });

  module('with GitHub Apps disabled', function (hooks) {

    hooks.beforeEach(async function () {
      await profilePage.visit();
    });

    test('tab is not visible', function (assert) {
      assert.ok(profilePage.migrate.isHidden);
    });

  });

});

function generateRepositoriesForMigration(server, user) {
  server.createList('repository', 10, {
    active_on_org: true,
    managed_by_installation: true,
    owner: {
      login: user.login,
    },
    permissions: {
      admin: true
    },
    active: true,
  });
}
