Travis.AccountIndexController = Em.Controller.extend
  needs: ['profile', 'currentUser']
  hooksBinding: 'controllers.profile.hooks'
  allHooksBinding: 'controllers.profile.allHooks'
  unAdminisetableHooksBinding: 'controllers.profile.unAdminisetableHooks'
  userBinding: 'controllers.currentUser'

  sync: ->
    @get('user').sync()

  toggle: (hook) ->
    hook.toggle()
