import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import page from 'travis/tests/pages/repo-not-active';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { percySnapshot } from 'ember-percy';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | repo not active', function (hooks) {
  setupApplicationTest(hooks);

  test('view an active_on_org repository when GitHub Apps is present', async function (assert) {
    enableFeature('github-apps');

    const user = this.server.create('user', {
      name: 'Erika Musterfrau',
      login: 'musterfrau'
    });

    signInUser(user);

    this.server.create('repository', {
      slug: 'musterfrau/a-repo',
      active: true,
      active_on_org: true,
      permissions: {
        admin: true
      }
    });

    await page.visit({ organization: 'musterfrau', repo: 'a-repo' });

    percySnapshot(assert);
    assert.dom('[data-test-active_on_org-display]').exists();
  });
});
