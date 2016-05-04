import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('signInUser', function(app, user) {
  const localStorageUser = JSON.parse(JSON.stringify(user.attrs));
  localStorageUser.token = "testUserToken";
  window.localStorage.setItem('travis.token', 'testUserToken');
  window.localStorage.setItem('travis.user', JSON.stringify(localStorageUser));
});
