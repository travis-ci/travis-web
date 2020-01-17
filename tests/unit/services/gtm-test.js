import Service from '@ember/service';
import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { stubService } from 'travis/tests/helpers/stub-service';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | auth/call gtm', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  let callCounter = 0;

  const gtmServiceStub = Service.extend({
    trackEvent(params) {
      callCounter++;
    }
  });

  hooks.beforeEach(function () {
    this.currentUser = this.server.create('user');
    signInUser(this.currentUser);
    stubService('metrics', gtmServiceStub);
  });

  test('gtm call is performed once user signs up', async function (assert) {
    await visit('/');
    assert.ok(callCounter === 2); // two calls: first one without auth providers, second one with providers
  });
});
