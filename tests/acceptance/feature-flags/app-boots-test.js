import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import { Response } from 'ember-cli-mirage';
import Service from '@ember/service';
import signInUser from 'travis/tests/helpers/sign-in-user';

moduleForAcceptance('Acceptance | feature flags/app boots');

test('app boots even if call to `/beta_features` fails', function (assert) {
  assert.expect(2);

  server.get('/user/:user_id/beta_features', function (schema) {
    return new Response(500, {}, {});
  });

  const currentUser = server.create('user');
  signInUser(currentUser);

  const mockSentry = Service.extend({
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

test('app does not request feature flags on boot if available in local storage', function (assert) {
  assert.expect(1);

  server.get('/user/:user_id/beta_features', function (schema) {
    assert.ok(false);
  });

  const currentUser = server.create('user');
  signInUser(currentUser);

  window.localStorage.setItem('travis.features', JSON.stringify([{foo: false}, {bar: false}]));

  visit('/');

  andThen(() => {
    assert.ok(true);
  });
});
