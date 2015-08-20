`import Ember from 'ember'`

Controller = Ember.Controller.extend
  user: Ember.computed.alias('auth.currentUser')

  isSyncing: Ember.computed.alias('user.isSyncing')

`export default Controller`
