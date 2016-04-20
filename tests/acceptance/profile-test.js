import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
    });

    const activeHook = server.create('hook', {
      name: 'living-a-feminist-life',
      owner_name: 'feministkilljoy',
      active: true
    });

    const inactiveHook = server.create('hook', {
      name: 'willful-subjects',
      owner_name: 'feministkilljoy',
      active: false
    });

    const otherHook = server.create('hook', {
      name: 'feminism-is-for-everybody',
      owner_name: 'bellhooks',
      active: false
    });

    let localStorageUser = JSON.parse(JSON.stringify(currentUser.attrs));
    localStorageUser.token = "abc123";
    window.localStorage.setItem('travis.token', 'testUserToken');
    window.localStorage.setItem('travis.user', JSON.stringify(localStorageUser));
  },

  afterEach() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

test('view profile', function(assert) {
  profilePage.visit({username: 'feministkilljoy'});

  andThen(function() {
    assert.equal(profilePage.name, 'Sara Ahmed');

    assert.equal(profilePage.hooks().count, 2, 'expected two hooks');
    assert.equal(profilePage.hooks(0).name, 'feministkilljoy/living-a-feminist-life');
    assert.equal(profilePage.hooks(1).name, 'feministkilljoy/willful-subjects');
  });
});
