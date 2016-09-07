import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | dashboard/repositories', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    server.create('repository', { slug: 'travis-ci/travis-web' });
  }
});

test('visiting /dashboard/ with feature flag disabled', function (assert) {
  visit('/dashboard/');

  andThen(() => {
    assert.notEqual(currentURL(), '/dashboard/');
  });
});


test('visiting /dashboard/ with feature flag enabled', function (assert) {
  withFeature('dashboard');

  visit('/dashboard/');

  andThen(() => {
    assert.equal(currentURL(), '/dashboard/');
  });
});
