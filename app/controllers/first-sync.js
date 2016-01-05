import Ember from 'ember';

export default Ember.Controller.extend({
  user: Ember.computed.alias('auth.currentUser'),
  isSyncing: Ember.computed.alias('user.isSyncing')
});
