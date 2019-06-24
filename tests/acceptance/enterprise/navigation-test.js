import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | enterprise/navigation', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'trial',
        'expiration_time': new Date(new Date().getTime() + 1000).toISOString()
      };
    });
  });

  test('visiting `/` without being authenticated redirects to `/auth`', async function (assert) {
    enableFeature('enterpriseVersion');

    await visit('/');

    assert.equal(currentURL(), '/auth');
  });
});
