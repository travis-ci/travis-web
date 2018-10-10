import { module, test } from 'qunit';
import {
  getContext,
  visit,
  click,
  waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | profile/migration', function (hooks) {
  setupApplicationTest(hooks);

  test('viewing locked GitHub repositories with feature flag disabled', async function (assert) {
    enableFeature('github-apps');
    enableFeature('pro-version');

    this.user = server.create('user', {
      allowMigration: false
    });

    // create locked GitHub repository
    server.create('repository', {
      name: 'github-apps-locked-repository',
      owner: {
        login: this.user.login,
      },
      active: true,
      managed_by_installation: true,
      private: false,
      active_on_org: true
    });

    // create GitHub Apps installation
    server.create('installation', { owner: this.user });

    signInUser(this.user);

    await visit(`/profile/${this.user.login}`);

    // shows no migration msg
    const expectedMsg = 'The following repositories cannot be migrated to travis-ci.com at this time because they are currently active on our legacy platform travis-ci.org. This feature will be available shortly. Please read our docs on open source migration to learn more.';
    assert.dom('[data-test-locked-github-apps-repositories-notice]').hasText(expectedMsg);
  });

  test('migrating locked GitHub repositories (happy path)', async function (assert) {
    enableFeature('github-apps');
    enableFeature('pro-version');

    this.user = server.create('user', {
      allowMigration: true
    });

    // create locked GitHub repository
    this.lockedRepository = server.create('repository', {
      name: 'github-apps-locked-repository',
      owner: {
        login: this.user.login,
      },
      active: true,
      managed_by_installation: true,
      private: false,
      active_on_org: true,
      permissions: {
        migrate: true
      },
    });

    // create another locked GitHub repository (ensure things are aligned)
    server.create('repository', {
      name: 'another-github-apps-locked-repository',
      owner: {
        login: this.user.login,
      },
      active: true,
      managed_by_installation: true,
      private: false,
      active_on_org: true,
      permissions: {
        migrate: true
      },
    });

    // create GitHub Apps installation
    server.create('installation', { owner: this.user });

    signInUser(this.user);

    await visit(`/profile/${this.user.login}`);

    // shows no migration msg
    const expectedMsg = 'Authorized users can now migrate the following repositories currently active on our legacy platform travis-ci.org to travis-ci.com. Please read our docs on open source migration to learn more.';
    assert.dom('[data-test-locked-github-apps-repositories-notice]').hasText(expectedMsg);

    assert.dom('[data-test-locked-github-app-repository="github-apps-locked-repository"]').exists();

    await click('[data-test-migrate-repository-button]');
    assert.dom('[data-test-repository-migration-modal]').exists();

    await click('[data-test-repository-migration-modal-confirm-migration-button]');
    assert.dom('[data-test-repository-migration-modal]').doesNotExist();
    assert.dom('[data-test-migration-status="migrating"]').exists();

    let { owner } = getContext();
    let pusherService = owner.lookup('service:pusher');
    pusherService.receive('repository:migration', { repositoryId: this.lockedRepository.id, status: 'success' });

    await waitFor('[data-test-migration-status="success"]');
    assert.dom('[data-test-migration-status="success"]').exists();
  });

  test('migrating locked GitHub repositories (sad path)', async function (assert) {
    enableFeature('github-apps');
    enableFeature('pro-version');

    this.user = server.create('user', {
      allowMigration: true
    });

    // create locked GitHub repository
    this.lockedRepository = server.create('repository', {
      name: 'github-apps-locked-repository',
      owner: {
        login: this.user.login,
      },
      active: true,
      managed_by_installation: true,
      private: false,
      active_on_org: true,
      permissions: {
        migrate: true
      },
    });

    // create another locked GitHub repository (ensure things are aligned)
    server.create('repository', {
      name: 'another-github-apps-locked-repository',
      owner: {
        login: this.user.login,
      },
      active: true,
      managed_by_installation: true,
      private: false,
      active_on_org: true,
      permissions: {
        migrate: true
      },
    });

    // create GitHub Apps installation
    server.create('installation', { owner: this.user });

    signInUser(this.user);

    await visit(`/profile/${this.user.login}`);

    // shows no migration msg
    const expectedMsg = 'Authorized users can now migrate the following repositories currently active on our legacy platform travis-ci.org to travis-ci.com. Please read our docs on open source migration to learn more.';
    assert.dom('[data-test-locked-github-apps-repositories-notice]').hasText(expectedMsg);

    assert.dom('[data-test-locked-github-app-repository="github-apps-locked-repository"]').exists();

    await click('[data-test-migrate-repository-button]');
    assert.dom('[data-test-repository-migration-modal]').exists();

    await click('[data-test-repository-migration-modal-confirm-migration-button]');
    assert.dom('[data-test-repository-migration-modal]').doesNotExist();
    assert.dom('[data-test-migration-status="migrating"]').exists();

    let { owner } = getContext();
    let pusherService = owner.lookup('service:pusher');
    pusherService.receive('repository:migration', { repositoryId: this.lockedRepository.id, status: 'failed' });


    await waitFor('[data-test-migration-status="failed"]');
    assert.dom('[data-test-migration-status="failed"]').exists();
  });

  test('migrating locked GitHub repositories (cancel in modal)', async function (assert) {
    enableFeature('github-apps');
    enableFeature('pro-version');

    this.user = server.create('user', {
      allowMigration: true
    });

    // create locked GitHub repository
    this.lockedRepository = server.create('repository', {
      name: 'github-apps-locked-repository',
      owner: {
        login: this.user.login,
      },
      active: true,
      managed_by_installation: true,
      private: false,
      active_on_org: true,
      permissions: {
        migrate: true
      },
    });

    // create GitHub Apps installation
    server.create('installation', { owner: this.user });

    signInUser(this.user);

    await visit(`/profile/${this.user.login}`);

    assert.dom('[data-test-locked-github-app-repository="github-apps-locked-repository"]').exists();

    await click('[data-test-migrate-repository-button]');
    assert.dom('[data-test-repository-migration-modal]').exists();

    await click('[data-test-repository-migration-modal-cancel-migration-button]');
    assert.dom('[data-test-repository-migration-modal]').doesNotExist();
    assert.dom('[data-test-migration-status]').doesNotExist();
  });
});
