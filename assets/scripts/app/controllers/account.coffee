Travis.AccountController = Ember.ObjectController.extend
  allHooks: []
  needs: ['currentUser']
  userBinding: 'controllers.currentUser'

  init: ->
    @_super.apply this, arguments

    self = this
    Travis.on("user:synced", (->
      self.reloadHooks()
    ))

  toggle: (hook) ->
    hook.toggle()

  reloadHooks: ->
    if login = @get('login')
      @set('allHooks', Travis.Hook.find(all: true, owner_name: login))

  hooks: (->
    @reloadHooks() unless hooks = @get('allHooks')
    @get('allHooks').filter (hook) -> hook.get('admin')
  ).property('allHooks.length', 'allHooks')

  hooksWithoutAdmin: (->
    @reloadHooks() unless hooks = @get('allHooks')
    @get('allHooks').filter (hook) -> !hook.get('admin')
  ).property('allHooks.length', 'allHooks')

  showPrivateReposHint: (->
    Travis.config.show_repos_hint == 'private'
  ) .property()

  showPublicReposHint: (->
    Travis.config.show_repos_hint == 'public'
  ) .property()

  actions:
    sync: ->
      @get('user').sync()

