import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { Response } from 'ember-cli-mirage';
import Service from '@ember/service';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | feature flags/app boots', function (hooks) {
  setupApplicationTest(hooks);

  test('app boots even if call to `/beta_features` fails', async function (assert) {
    server.get('/user/:user_id/beta_features', function (schema) {
      return new Response(500, {}, {});
    });

    const currentUser = server.create('user');
    signInUser(currentUser);

    server.create('repository', {
      owner: {
        login: currentUser.login
      },
    });

    await visit('/');

    assert.equal(currentURL(), '/');
  });

  test('app does not request feature flags on boot if available in local storage', async function (assert) {
    assert.expect(1);

    server.get('/user/:user_id/beta_features', function (schema) {
      assert.ok(false);
    });

    const currentUser = server.create('user');
    signInUser(currentUser);

    window.localStorage.setItem('travis.features', JSON.stringify([{foo: false}, {bar: false}]));

    await visit('/');

    assert.ok(true);
  });
});
