import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import { setupMirage } from 'ember-cli-mirage/test-support';
import signInUser from 'travis/tests/helpers/sign-in-user';

module('Acceptance | licensing', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /licensing when signed in', async function (assert) {
    const currentUser = this.server.create('user');
    signInUser(currentUser);

    await visit('/licensing');

    assert.equal(currentURL(), '/licensing');
    assert.dom('.content-page h1').hasText('Licensing Information');
    assert.dom('.content-page h2').hasText('MIT Licenses #');
    assert.dom('.license-text').exists();
    assert.dom('.content-page').includesText('Travis CI relies on multiple Open-Source modules');
  });

  test('visiting /licensing when not signed in redirects to auth', async function (assert) {
    await visit('/licensing');

    assert.notEqual(currentURL(), '/licensing');
    // Should redirect to signin page
    assert.ok(currentURL().includes('/signin'));
  });
});
