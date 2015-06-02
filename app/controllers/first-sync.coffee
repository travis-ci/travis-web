`import Ember from 'ember'`

Controller = Ember.Controller.extend
  needs: ['currentUser']
  user: Ember.computed.alias('controllers.currentUser.model')

  isSyncing: Ember.computed.alias('user.isSyncing')

`export default Controller`
