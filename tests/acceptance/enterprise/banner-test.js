import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import { enterpriseBanners } from 'travis/tests/pages/enterprise-banner';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | enterprise/banner', {
  beforeEach() {
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
  }
});

test('banner is rendered in enterprise mode', function (assert) {
  withFeature('enterpriseVersion');
  visit('/');

  andThen(() => {});

  andThen(function () {
    assert.ok(enterpriseBanners.trialBanner.isVisible);
  });
});
