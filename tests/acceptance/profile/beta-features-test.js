import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile/beta features');

test('shows no link to beta features if user is not in program', function (assert) {
  const currentUser = server.create('user', {
    name: 'Sara Ahmed',
    login: 'feministkilljoy',
    repos_count: 3
  });

  signInUser(currentUser);

  profilePage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.notOk(profilePage.betaFeaturesLink, 'does not show beta features link unless user is beta program participant');
  });
});

test('shows link to beta features if user is in program', function (assert) {
  const currentUser = server.create('user', {
    name: 'Sara Ahmed',
    login: 'feministkilljoy',
    repos_count: 3,
    beta_program: true,
  });

  signInUser(currentUser);

  profilePage.visit({ username: 'feministkilljoy' });

  andThen(() => {
    assert.ok(profilePage.betaFeaturesLink, 'shows beta features link for program participant');
  });
});
