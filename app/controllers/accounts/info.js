import Ember from 'ember';

const { controller } = Ember.inject;

export default Ember.Controller.extend({
  repos: controller(),
  userBinding: 'auth.currentUser'
});
