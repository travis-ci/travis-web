import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | repo/view migrated', function (hooks) {
  setupApplicationTest(hooks);

  test('viewing migrated repository on com shows banner', async function (assert) {
    enableFeature('proVersion');

    const user = this.server.create('user', {
      name: 'Erika Musterfrau',
      login: 'musterfrau'
    });

    await signInUser(user);

    const repository = this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: true,
      active_on_org: false,
      permissions: {
        admin: true
      },
      migration_status: 'migrated',
    });

    await visit(`${repository.slug}`);

    assert.dom('[data-test-recently-migrated-from-org-banner]').exists();
  });

  test('viewing migrated repository on org shows banner', async function (assert) {
    const user = this.server.create('user', {
      name: 'Erika Musterfrau',
      login: 'musterfrau'
    });

    await signInUser(user);

    const repository = this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: false,
      active_on_org: false,
      permissions: {
        admin: true
      },
      migration_status: 'migrated',
    });

    await visit(`${repository.slug}`);

    assert.dom('[data-test-recently-migrated-to-com-banner]').exists();
  });
});
