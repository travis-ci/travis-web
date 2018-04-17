import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import signInUser from 'travis/tests/helpers/sign-in-user';
import { Response } from 'ember-cli-mirage';

moduleForAcceptance('Acceptance | auth/GitHub Apps installation redirect', {
  beforeEach() {
    this.currentUser = server.create('user');
    signInUser(this.currentUser);
  }
});

test('it polls until the GitHub installation ID resolves to an owner', function (assert) {
  let done = assert.async();
  let repetition = 0;

  let installation = server.create('installation');

  installation.createOwner('organization', {
    login: 'the-org'
  });

  server.get('/installation/:id', (schema, {params: {id}}) => {
    if (repetition < 2) {
      repetition++;
      return new Response(404, {}, {});
    } else {
      assert.equal(id, installation.id, 'expected the API request to include the correct installation ID');
      return schema.installations.find(id);
    }
  });

  visit(`/settings/github-apps-installations/redirect?installation_id=${installation.id}`);

  andThen(() => {
    assert.dom('[data-test-github-apps-polling]').hasText('polling!');
  });

  setTimeout(() => {
    done();

    andThen(() => {
      assert.equal(currentURL(), '/profile/the-org');
    });
  }, 6000);
  // FIXME huuuuuge timeout
});
