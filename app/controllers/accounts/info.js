import Ember from 'ember';

const { alias } = Ember.computed;
const { controller, service } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),
  repos: controller(),

  user: alias('auth.currentUser'),
});
