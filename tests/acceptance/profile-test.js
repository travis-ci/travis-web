import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import profilePage from 'travis/tests/pages/profile';

moduleForAcceptance('Acceptance | profile', {
  beforeEach() {
    const currentUser = server.create('user', {
      name: 'Sara Ahmed',
      login: 'feministkilljoy'
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
  });
});
