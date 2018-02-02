import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import { Response } from 'ember-cli-mirage';


moduleForAcceptance('Acceptance | feature flags/app boots');

test('visiting /feature-flags/app-boots', function (assert) {
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

  visit('/');

  andThen(function () {
    assert.equal(currentURL(), '/');
  });
});
