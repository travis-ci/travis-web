import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import page from 'travis/tests/pages/repo-not-active';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | repo not active', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('view inactive repo when not an admin or signed out', async function (assert) {
    this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: false,
      permissions: {
        admin: false
      },
      owner: {
        login: 'musterfrau',
        id: 1
      }
    });

    this.server.create('user', {
      name: 'Erika Musterfrau',
      login: 'musterfrau'
    });
    this.server.create('allowance', {subscription_type: 1});

    await page.visit({ organization: 'musterfrau', repo: 'a-repo' });

    assert.ok(page.notActiveHeadline, 'Displays not active headline');
    assert.equal(page.notActiveNotice, 'You don\'t have sufficient rights to enable this repo on Travis. Please contact the admin to enable it or to receive admin rights yourself.', 'Displays non-admin notice');
    assert.notOk(page.activateButton, 'Does not show activation button');
  });

  test('view inactive repo when admin and activate it', async function (assert) {
    this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: false,
      permissions: {
        admin: true
      },
      owner: {
        login: 'musterfrau',
        id: 1
      }
    });

    const user = this.server.create('user', {
      name: 'Erika Musterfrau',
      login: 'musterfrau'
    });
    this.server.create('allowance', {subscription_type: 1});

    signInUser(user);

    await page.visit({ organization: 'musterfrau', repo: 'a-repo' });

    assert.ok(page.notActiveHeadline, 'Displays not active headline');
    assert.equal(page.notActiveNotice, 'You can activate the repository on your profile, or by clicking the button below', 'Displays admin notice');
    assert.ok(page.activateButton, 'Show activation button');
    assert.notOk(page.githubAppsActivateButton, 'Does not show Github Apps activation button');
  });

  test('migrated repository does not show activation button or settings', async function (assert) {
    this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: false,
      migration_status: 'migrated',
      permissions: {
        admin: true,
      },
      owner: {
        login: 'musterfrau',
        id: 1
      }
    });

    const user = this.server.create('user', {
      name: 'Erika Musterfrau',
      login: 'musterfrau'
    });

    this.server.create('allowance', {subscription_type: 1});

    signInUser(user);

    await visit('/account/repositories');

    assert.dom('[data-test-already-migrated-link]').exists();
  });

  test('view inactive repo when admin connected to Github Apps and activate it', async function (assert) {
    this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: false,
      permissions: {
        admin: true
      },
      githubId: 12345,
      owner: {
        github_id: 321,
        installation: {
          id: 5678
        },
        login: 'musterfrau',
        id: 1
      }
    });

    const user = this.server.create('user', {
      name: 'Erika Musterfrau',
      login: 'musterfrau'
    });

    this.server.create('allowance', {subscription_type: 1});

    signInUser(user);

    await page.visit({ organization: 'musterfrau', repo: 'a-repo' });

    assert.ok(page.notActiveHeadline, 'Displays not active headline');
    assert.ok(page.githubAppsActivateButton, 'Show Github Apps activation button');
    assert.notOk(page.activateButton, 'Does not show legacy activation button');
  });
});
