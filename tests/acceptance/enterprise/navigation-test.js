import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { enableFeature } from 'ember-feature-flags/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | enterprise/navigation', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'trial',
        'expiration_time': new Date(new Date().getTime() + 1000).toISOString()
      };
    });
  });

  test('visiting `/` without being authenticated redirects to `/signin`', async function (assert) {
    enableFeature('enterpriseVersion');

    await visit('/');

    assert.equal(currentURL(), '/signin');
  });
});
