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

  server.get('/owner/github_apps_installation_id/:id', (schema, {params: {id}}) => {
    if (repetition < 2) {
      repetition++;
      return new Response(404, {}, {});
    } else {
      assert.equal(id, installation.id, 'expected the API request to include the correct installation ID');
      return schema.installations.find(id).owners.models[0];
    }
  });

  visit(`/github_apps_installation?installation_id=${installation.id}`);

  andThen(() => {
    assert.dom('[data-test-github-apps-polling]').hasText('polling!');
  });

  setTimeout(() => {
    done();

    andThen(() => {
      assert.equal(currentURL(), '/profile/the-org');
    });
  }, 2000);
});
