Controller = Ember.Controller.extend
  needs: ['currentUser', 'repos']
  userBinding: 'controllers.currentUser'

Travis.AccountsInfoController = Controller
