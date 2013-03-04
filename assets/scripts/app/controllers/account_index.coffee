Travis.AccountIndexController = Em.Controller.extend
  needs: ['profile', 'currentUser']
  hooksBinding: 'controllers.profile.hooks'
  userBinding: 'controllers.currentUser'

  sync: ->
    @get('user').sync()
