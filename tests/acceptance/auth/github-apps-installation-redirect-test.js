import { currentURL, visit } from '@ember/test-helpers';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { Response } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | auth/GitHub Apps installation redirect', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.currentUser = this.server.create('user');
    signInUser(this.currentUser);
  });

  // FIXME turning this off due to intermittent failure, for now.
  skip('it polls until the GitHub installation ID resolves to an owner', async function (assert) {
    let done = assert.async();
    let repetition = 0;

    let installation = this.server.create('installation');

    installation.createOwner('organization', {
      login: 'the-org'
    });

    this.server.get('/installation/:id', (schema, {params: {id}}) => {
      if (repetition < 2) {
        repetition++;
        return new Response(404, {}, {});
      } else {
        assert.equal(id, installation.id, 'expected the API request to include the correct installation ID');
        return schema.installations.find(id);
      }
    });

    await visit(`/settings/github-apps-installations/redirect?installation_id=${installation.id}`);

    assert.dom('[data-test-github-apps-polling]').exists();

    setTimeout(() => {
      done();

      assert.equal(currentURL(), '/profile/the-org');
    }, 10000);
    // FIXME huuuuuge timeout
  });
});
