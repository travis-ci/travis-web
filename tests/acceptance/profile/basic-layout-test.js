import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile/basic layout', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    // create organization
    server.create('account', {
      name: 'Feminist Killjoys',
      type: 'organization',
      login: 'killjoys',
      repos_count: 30
    });

    // create active hook
    server.create('hook', {
      name: 'living-a-feminist-life',
      owner_name: 'feministkilljoy',
      active: true,
      admin: true
    });

    // create inactive hook
    server.create('hook', {
      name: 'willful-subjects',
      owner_name: 'feministkilljoy',
      active: false,
      admin: true
    });

    // create hook without admin permissions
    server.create('hook', {
      name: 'affect-theory-reader',
      owner_name: 'feministkilljoy',
      active: true,
      admin: false
    });

    // create other random hook to ensure correct filtering
    server.create('hook', {
      name: 'feminism-is-for-everybody',
      owner_name: 'bellhooks',
      active: false
    });
  }
});

test('view profile', function (assert) {
  profilePage.visit({ username: 'feministkilljoy' });

  andThen(function () {
    assert.equal(document.title, 'Sara Ahmed - Profile - Travis CI');

    assert.equal(profilePage.name, 'Sara Ahmed');

    assert.equal(profilePage.accounts().count, 2, 'expected two accounts');

    assert.equal(profilePage.accounts(0).name, 'Sara Ahmed');
    assert.equal(profilePage.accounts(0).repositoryCount, 3);

    assert.equal(profilePage.accounts(1).name, 'Feminist Killjoys');
    assert.equal(profilePage.accounts(1).repositoryCount, 30);

    assert.equal(profilePage.administerableHooks().count, 2, 'expected two administerable hooks');

    assert.equal(profilePage.administerableHooks(0).name, 'feministkilljoy/living-a-feminist-life');
    assert.ok(profilePage.administerableHooks(0).isActive, 'expected active hook to appear active');

    assert.equal(profilePage.administerableHooks(1).name, 'feministkilljoy/willful-subjects');
    assert.notOk(profilePage.administerableHooks(1).isActive, 'expected inactive hook to appear inactive');

    assert.equal(profilePage.unadministerableHooks().count, 1, 'expected one unadministerable hook');
  });
});
