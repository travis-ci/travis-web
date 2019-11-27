import Service from '@ember/service';
import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { stubService } from 'travis/tests/helpers/stub-service';

module('Acceptance | auth/call gtm', function (hooks) {
  setupApplicationTest(hooks);

  let callCounter = 0;

  const gtmServiceStub = Service.extend({
    trackEvent(params) {
      callCounter++;
    }
  });

  hooks.beforeEach(function () {
    this.currentUser = server.create('user');
    signInUser(this.currentUser);
    stubService('metrics', gtmServiceStub);
  });

  test('gtm call is performed once user signs up', async function (assert) {
    await visit('/');
    assert.ok(callCounter === 1);
  });
});
