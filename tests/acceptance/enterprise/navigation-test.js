import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

let adapterException;

moduleForAcceptance('Acceptance | enterprise/navigation', {
  beforeEach() {
    server.get('/v3/enterprise_license', (schema, response) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
        'license_type': 'trial',
        'expiration_time': new Date(new Date().getTime() + 1000).toISOString()
      };
    });
  },
});

test('visiting `/` without being authenticated redirects to `/auth`', function (assert) {
  withFeature('enterpriseVersion');

  visit('/');

  andThen(function () {
    assert.equal(currentURL(), '/auth');
  });
});
