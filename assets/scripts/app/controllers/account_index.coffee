Travis.AccountIndexController = Em.Controller.extend
  needs: ['profile', 'currentUser']
  hooksBinding: 'controllers.profile.hooks'
  allHooksBinding: 'controllers.profile.allHooks'
  hooksWithoutAdminBinding: 'controllers.profile.hooksWithoutAdmin'
  userBinding: 'controllers.currentUser'

  sync: ->
    @get('user').sync()

  toggle: (hook) ->
    hook.toggle()

  showPrivateReposHint: (->
    Travis.config.show_repos_hint == 'private'
  ) .property()

  showPublicReposHint: (->
    Travis.config.show_repos_hint == 'public'
  ) .property()
