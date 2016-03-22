import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy',
      repos_count: 3
    });

    signInUser(currentUser);

    const organization = server.create('account', {
      name: 'Goldsmiths',
      type: 'organization',
      login: 'goldsmiths',
      repos_count: 30
    });

    const activeHook = server.create('hook', {
      name: 'living-a-feminist-life',
      owner_name: 'feministkilljoy',
      active: true,
      admin: true
    });

    const inactiveHook = server.create('hook', {
      name: 'willful-subjects',
      owner_name: 'feministkilljoy',
      active: false,
      admin: true
    });

    const unadministerableHook = server.create('hook', {
      name: 'affect-theory-reader',
      owner_name: 'feministkilljoy',
      active: true,
      admin: false
    });

    const otherHook = server.create('hook', {
      name: 'feminism-is-for-everybody',
      owner_name: 'bellhooks',
      active: false
    });
  }
});

test('view profile', function(assert) {
  profilePage.visit({username: 'feministkilljoy'});

  andThen(function() {
    assert.equal(profilePage.name, 'Sara Ahmed');

    assert.equal(profilePage.accounts().count, 2, 'expected two accounts');

    assert.equal(profilePage.accounts(0).name, 'Sara Ahmed');
    assert.equal(profilePage.accounts(0).repositoryCount, 3);

    assert.equal(profilePage.accounts(1).name, 'Goldsmiths');
    assert.equal(profilePage.accounts(1).repositoryCount, 30);

    assert.equal(profilePage.administerableHooks().count, 2, 'expected two administerable hooks');

    assert.equal(profilePage.administerableHooks(0).name, 'feministkilljoy/living-a-feminist-life');
    assert.ok(profilePage.administerableHooks(0).isActive, 'expected active hook to appear active');

    assert.equal(profilePage.administerableHooks(1).name, 'feministkilljoy/willful-subjects');
    assert.notOk(profilePage.administerableHooks(1).isActive, 'expected inactive hook to appear inactive');

    assert.equal(profilePage.unadministerableHooks().count, 1, 'expected one unadministerable hook');
  });
});

test('view token', function(assert) {
  profilePage.visit({username: 'feministkilljoy'});

  andThen(() => {
    assert.ok(profilePage.token.isHidden, 'expected token to be hidden by default');
  });

  profilePage.token.show();

  andThen(function() {
    assert.equal(profilePage.token.value, 'testUserToken');
  });
});

test('updating hooks', function(assert) {
  profilePage.visit({username: 'feministkilljoy'});

  profilePage.administerableHooks(0).toggle();
  profilePage.administerableHooks(1).toggle();
  profilePage.unadministerableHooks(0).toggle();

  andThen(() => {
    assert.notOk(server.db.hooks[0].active, 'expected formerly active hook to be inactive');
    assert.ok(server.db.hooks[1].active, 'expected formerly inactive hook to be active');
    assert.ok(server.db.hooks[2].active, 'expected unadministerable hook to be unchanged');
  });
});
