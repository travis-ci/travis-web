import Ember from 'ember';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  name: 'profile',
  auth: service(),
  user: alias('auth.currentUser')
});
