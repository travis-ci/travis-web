import {
  currentURL,
  visit,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { Response } from 'ember-cli-mirage';
import Service from '@ember/service';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { stubService } from 'travis/tests/helpers/stub-service';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | feature flags/app boots', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('app boots even if call to `/beta_features` fails', async function (assert) {
    assert.expect(2);
    this.server.get('/user/:user_id/beta_features', function (schema) {
      return new Response(500, {}, {});
    });

    const currentUser = this.server.create('user');
    signInUser(currentUser);

    const mockSentry = Service.extend({
      logException(error) {
        assert.ok(true);
      },
    });

    stubService('raven', mockSentry);

    this.server.create('repository', {
      owner: {
        login: currentUser.login
      },
    });

    await visit('/');

    assert.equal(currentURL(), '/');
  });

  test('app does not request feature flags on boot if available in local storage', async function (assert) {
    assert.expect(1);

    this.server.get('/user/:user_id/beta_features', function (schema) {
      assert.ok(false);
    });

    const currentUser = this.server.create('user');
    signInUser(currentUser);

    window.localStorage.setItem('travis.features', JSON.stringify({ [currentUser.name]: [{ foo: false }, { bar: false }] }));

    await visit('/');

    assert.ok(true);
  });
});
