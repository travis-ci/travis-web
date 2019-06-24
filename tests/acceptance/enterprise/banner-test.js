import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { enterpriseBanners } from 'travis/tests/pages/enterprise-banner';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { enableFeature } from 'ember-feature-flags/test-support';

module('Acceptance | enterprise/banner', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const currentUser = server.create('user');
    signInUser(currentUser);

    server.get('/v3/enterprise_license', (schema, request) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'trial',
        'expiration_time': '2019-01-01T00:00:00Z'
      };
    });
  });

  test('banner is rendered in enterprise mode', async function (assert) {
    enableFeature('enterpriseVersion');
    await visit('/');

    assert.ok(enterpriseBanners.trialBanner.isVisible);
  });
});
