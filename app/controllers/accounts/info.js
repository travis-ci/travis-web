import Ember from 'ember';

export default Ember.Controller.extend({
  repos: Ember.inject.controller(),
  userBinding: 'auth.currentUser'
});
