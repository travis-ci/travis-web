import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import Service from '@ember/service';
import { stubService } from 'travis/tests/helpers/stub-service';

module('Acceptance | profile/redirect', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.user = server.create('user', { login: 'test-user' });
    this.org = server.create('organization', { login: 'test-org' });
    server.create('plan', { id: 'travis-ci-one-build', name: 'AM', builds: 1, price: 6900, currency: 'USD' });
    signInUser(this.user);

    let mockStripe = Service.extend({
      load() { }
    });

    stubService('stripe', mockStripe);
  });

  test('visiting /profile redirects to /account/repositories', async function (assert) {
    await visit('/profile');
    assert.equal(currentURL(), '/account/repositories');
  });

  test('visiting /profile/:username/repositories redirects to /account/repositories', async function (assert) {
    await visit(`/profile/${this.user.login}/repositories`);
    assert.equal(currentURL(), '/account/repositories');
  });

  test('visiting /profile/:username redirects to /account/repositories', async function (assert) {
    await visit(`/profile/${this.user.login}`);
    assert.equal(currentURL(), '/account/repositories');
  });

  test('visiting /profile/:username/settings redirects to /account/preferences', async function (assert) {
    await visit(`/profile/${this.user.login}/settings`);
    assert.equal(currentURL(), '/account/preferences');
  });

  test('visiting /profile/:username/subscription redirects to /account/subscription', async function (assert) {
    await visit(`/profile/${this.user.login}/subscription`);
    assert.equal(currentURL(), '/account/subscription');
  });

  test('visiting /profile/:org redirects to /organisations/:org/repositories', async function (assert) {
    await visit(`/profile/${this.org.login}`);
    assert.equal(currentURL(), `/organizations/${this.org.login}/repositories`);
  });

  test('visiting /profile/:org/repositories redirects to /organisations/:org/repositories', async function (assert) {
    await visit(`/profile/${this.org.login}/repositories`);
    assert.equal(currentURL(), `/organizations/${this.org.login}/repositories`);
  });

  test('visiting /profile/:org/subscription redirects to /organisations/:org/subscription', async function (assert) {
    await visit(`/profile/${this.org.login}/subscription`);
    assert.equal(currentURL(), `/organizations/${this.org.login}/subscription`);
  });
});

