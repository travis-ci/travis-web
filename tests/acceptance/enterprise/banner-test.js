import { module } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | enterprise/banner', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const currentUser = this.server.create('user');
    signInUser(currentUser);

    this.server.get('/v3/enterprise_license', (schema, request) => ({
      'license_id': 'ad12345',
      'seats': '30',
      'active_users': '21',
      'license_type': 'trial',
      'expiration_time': '2019-01-01T00:00:00Z'
    }));
  });
});
