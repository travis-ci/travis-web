import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import { Response } from 'ember-cli-mirage';

moduleForAcceptance('Acceptance | feature flags/app boots');

test('app boots even if call to `/beta_features` fails', function (assert) {
  assert.expect(2);

  server.get('/user/:user_id/beta_features', function (schema) {
    return new Response(500, {}, {});
  });

  const currentUser = server.create('user');
  signInUser(currentUser);

  const mockSentry = Ember.Service.extend({
    logException(error) {
      assert.ok(true);
    },
  });

  const instance = this.application.__deprecatedInstance__;
  const registry = instance.register ? instance : instance.registry;
  registry.register('service:raven', mockSentry);

  server.create('repository', {
    owner: {
      login: currentUser.login
    },
  });

  visit('/');

  andThen(function () {
    assert.equal(currentURL(), '/');
  });
});
