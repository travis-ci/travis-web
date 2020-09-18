import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | repo/view migrated', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('viewing migrated repository on com shows banner', async function (assert) {
    enableFeature('proVersion');

    const user = this.server.create('user', {
      name: 'Erika Musterfrau',
      login: 'musterfrau'
    });

    await signInUser(user);

    this.server.create('allowance', { subscription_type: 1 });
    this.server.create('allowance', { subscription_type: 1 });

    const repository = this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: true,
      active_on_org: false,
      permissions: {
        admin: true
      },
      owner: {
        login: 'musterfrau',
        id: 1
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
    this.server.create('allowance', { subscription_type: 1 });

    await signInUser(user);

    const repository = this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: false,
      active_on_org: false,
      permissions: {
        admin: true
      },
      migration_status: 'migrated',
      owner: {
        login: 'musterfrau',
        id: 2
      }
    });

    await visit(`${repository.slug}`);

    assert.dom('[data-test-recently-migrated-to-com-banner]').exists();
  });
});
