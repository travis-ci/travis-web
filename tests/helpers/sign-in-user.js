import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('signInUser', function (app, user) {
  const token = 'testUserToken';
  user.attrs.token = token;
  user.save();

  const localStorageUser = JSON.parse(JSON.stringify(user.attrs));
  localStorageUser.token = token;
  window.localStorage.setItem('travis.token', token);
  window.localStorage.setItem('travis.user', JSON.stringify(localStorageUser));
});
